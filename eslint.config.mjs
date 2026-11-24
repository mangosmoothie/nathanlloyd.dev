import eslint from '@eslint/js';
import globals from 'globals';
import prettierPlugin from 'eslint-plugin-prettier';
import typescriptEsLintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptEsLintParser from '@typescript-eslint/parser';
import vitest from '@vitest/eslint-plugin';

export default [
    eslint.configs.recommended,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: typescriptEsLintParser,
        },
        plugins: {
            '@typescript-eslint': typescriptEsLintPlugin,
        },
        rules: {
            ...typescriptEsLintPlugin.configs.recommended.rules,
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'default',
                    format: ['camelCase', 'UPPER_CASE'],
                    leadingUnderscore: 'allow',
                    trailingUnderscore: 'allow',
                },
                {
                    selector: ['objectLiteralProperty', 'import'],
                    format: null,
                },
                {
                    selector: ['class', 'interface', 'typeAlias', 'typeParameter'],
                    format: ['PascalCase'],
                },
                {
                    selector: ['enum', 'enumMember'],
                    format: ['UPPER_CASE'],
                },
            ],
        },
    },
    {
        files: ['**/*.test.ts'],
        plugins: {
            vitest,
        },
        languageOptions: {
            globals: {
                ...vitest.environments.env.globals,
                ...globals.browser,
            },
        },
        rules: {
            ...vitest.configs.recommended.rules,
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    {
        files: ['website/src/**/*.ts'],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
    },
    {
        ignores: [
            '**/dist/',
            '**/node_modules/**',
            'cdk/cdk.out/**',
            'cdk/cdk.context.json',
            'package-lock.json',
            'cdk.json',
        ],
    },
    {
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            ...prettierPlugin.configs.recommended.rules,
        },
    },
];
