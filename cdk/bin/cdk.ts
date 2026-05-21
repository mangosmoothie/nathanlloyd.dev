import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cdk from 'aws-cdk-lib/core';
import { PipelineStack } from '../src/stacks/pipeline-stack';

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
dotenv.config({ path: path.join(rootDir, '.env'), override: true });

const app = new cdk.App();
new PipelineStack(app, 'PortfolioPipelineStack', {
    env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
