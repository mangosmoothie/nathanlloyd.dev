import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import PortfolioAppStage from '../stages/portfolio-app-stage';
import { appConfig } from '../config';

type Props = cdk.StackProps;

export class PipelineStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id, props);

        const repo = cdk.pipelines.CodePipelineSource.gitHub('mangosmoothie/nathanlloyd.dev', 'main');

        const pipeline = new cdk.pipelines.CodePipeline(this, 'Pipeline', {
            pipelineName: 'PortfolioPipeline',
            crossAccountKeys: false,
            synth: new cdk.pipelines.CodeBuildStep('Synth', {
                input: repo,
                partialBuildSpec: cdk.aws_codebuild.BuildSpec.fromObject({
                    version: '0.2',
                    phases: {
                        install: {
                            'runtime-versions': { nodejs: '24' },
                        },
                    },
                }),
                commands: ['npm run install:ci', 'npm run build:ci', 'npm run synth:ci'],
                primaryOutputDirectory: 'cdk/cdk.out',
            }),
            synthCodeBuildDefaults: {
                rolePolicy: [
                    new iam.PolicyStatement({
                        actions: ['route53:ListHostedZonesByName'],
                        resources: ['*'],
                    }),
                ],
            },
        });

        pipeline.addStage(
            new PortfolioAppStage(this, 'PortfolioAppStage', {
                ...appConfig,
                env: { account: this.account, region: this.region },
            })
        );
    }
}
