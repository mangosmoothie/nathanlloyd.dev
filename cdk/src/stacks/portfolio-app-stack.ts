import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as ses from 'aws-cdk-lib/aws-ses';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { AppConfig } from '../config';

type Props = cdk.StackProps & AppConfig & { certificateArn: string };

export default class PortfolioAppStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id, props);

        const lambdaDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../lambda');
        const websiteDist = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../../website/dist');

        const sesIdentity = new ses.EmailIdentity(this, 'SesIdentity', {
            identity: ses.Identity.domain(props.domain),
        });

        const contactPost = new lambda.NodejsFunction(this, 'ContactFn', {
            entry: path.join(lambdaDir, 'contact.ts'),
            handler: 'handler',
            runtime: cdk.aws_lambda.Runtime.NODEJS_24_X,
            environment: {
                TO_ADDRESS: props.contactToAddress,
                FROM_ADDRESS: props.contactFromAddress,
            },
            logGroup: new cdk.aws_logs.LogGroup(this, 'ContactFnLogs', {
                retention: cdk.aws_logs.RetentionDays.ONE_WEEK,
                removalPolicy: cdk.RemovalPolicy.DESTROY,
            }),
            bundling: {
                externalModules: ['@aws-sdk/*'],
            },
        });

        sesIdentity.grantSendEmail(contactPost);
        contactPost.addToRolePolicy(
            new cdk.aws_iam.PolicyStatement({
                actions: ['ses:SendEmail', 'ses:SendRawEmail'],
                resources: [`arn:aws:ses:${this.region}:${this.account}:identity/${props.contactFromAddress}`],
            })
        );

        const api = new apigw.RestApi(this, 'ContactApi', {
            restApiName: 'contact-api',
            deployOptions: {
                throttlingRateLimit: 2,
                throttlingBurstLimit: 10,
            },
            defaultCorsPreflightOptions: {
                allowOrigins: ['https://nathanlloyd.dev'],
                allowMethods: apigw.Cors.ALL_METHODS,
            },
        });

        api.root.addResource('api').addResource('contact').addMethod('POST', new apigw.LambdaIntegration(contactPost));

        new cdk.CfnOutput(this, 'ContactApiUrl', { value: api.url });

        const apiDomain = cdk.Fn.join('.', [api.restApiId, 'execute-api', this.region, 'amazonaws.com']);
        const apiOrigin = new origins.HttpOrigin(apiDomain, {
            originPath: '/prod',
            protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
        });

        const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', { domainName: props.domain });

        const certificate = acm.Certificate.fromCertificateArn(this, 'Certificate', props.certificateArn);

        const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
            autoDeleteObjects: false,
        });

        new s3deploy.BucketDeployment(this, 'WebsiteDeployment', {
            sources: [s3deploy.Source.asset(websiteDist)],
            destinationBucket: websiteBucket,
            prune: true,
        });

        const distribution = new cloudfront.Distribution(this, 'Distribution', {
            defaultBehavior: {
                origin: origins.S3BucketOrigin.withOriginAccessControl(websiteBucket),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
            },
            domainNames: [props.domain, `www.${props.domain}`],
            certificate,
            defaultRootObject: 'index.html',
            errorResponses: [
                {
                    httpStatus: 403,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html',
                },
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html',
                },
            ],
            additionalBehaviors: {
                '/api/contact': {
                    origin: apiOrigin,
                    allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
                    cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
                    originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
                    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                },
            },
        });

        new route53.ARecord(this, 'AliasRecord', {
            zone: hostedZone,
            target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
        });

        new route53.ARecord(this, 'WwwAliasRecord', {
            zone: hostedZone,
            recordName: 'www',
            target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
        });

        new cdk.CfnOutput(this, 'BucketName', { value: websiteBucket.bucketName });
        new cdk.CfnOutput(this, 'DistributionId', { value: distribution.distributionId });
        new cdk.CfnOutput(this, 'DistributionDomain', { value: distribution.distributionDomainName });
    }
}
