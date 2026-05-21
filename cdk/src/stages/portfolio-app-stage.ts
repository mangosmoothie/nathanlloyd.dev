import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import PortfolioAppStack from '../stacks/portfolio-app-stack';
import { AppConfig } from '../config';

type Props = cdk.StageProps & AppConfig;

export default class PortfolioAppStage extends cdk.Stage {
    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id, props);

        const certStack = new cdk.Stack(this, 'CertificateStack', {
            env: { account: props.env?.account, region: 'us-east-1' },
            crossRegionReferences: true,
        });

        const hostedZone = route53.HostedZone.fromLookup(certStack, 'HostedZone', { domainName: props.domain });

        const certificate = new acm.Certificate(certStack, 'Certificate', {
            domainName: props.domain,
            subjectAlternativeNames: [`www.${props.domain}`],
            validation: acm.CertificateValidation.fromDns(hostedZone),
        });

        new PortfolioAppStack(this, 'PortfolioAppStack', {
            ...props,
            crossRegionReferences: true,
            certificateArn: certificate.certificateArn,
        });
    }
}
