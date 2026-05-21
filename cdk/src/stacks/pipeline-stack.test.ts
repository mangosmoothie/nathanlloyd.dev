import { describe, test, expect } from 'vitest';
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from './pipeline-stack';
import { Template } from 'aws-cdk-lib/assertions';

describe('pipeline-stack', () => {
    test('placeholder', () => {
        const app = new cdk.App();
        const stack = new PipelineStack(app, 'PipelineStack', {
            env: {
                account: '123456789012',
                region: 'us-east-1',
            },
        });
        const template = Template.fromStack(stack);
        template.resourceCountIs('AWS::CodePipeline::Pipeline', 1);
        expect(template).toBeTruthy();
    });
});
