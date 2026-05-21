export default {
    endOfLine: 'lf',
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    printWidth: 120,
    trailingComma: 'es5',
    overrides: [
        {
            files: '*.html',
            options: {
                parser: 'html',
            },
        },
    ],
};
