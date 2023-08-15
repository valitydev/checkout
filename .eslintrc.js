module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'import', 'react'],
    root: true,
    rules: {
        'import/order': [
            'error',
            {
                alphabetize: {
                    caseInsensitive: true,
                    order: 'asc',
                },
                groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index'], 'object'],
                'newlines-between': 'always',
                pathGroups: [
                    {
                        group: 'internal',
                        pattern: 'checkout/**',
                    },
                ],
                pathGroupsExcludedImportTypes: ['builtin'],
            },
        ],
        'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.ts'] }],
        'react/jsx-max-depth': ['error', { max: 3 }],
        'react/jsx-sort-props': [
            'error',
            {
                callbacksLast: true,
                ignoreCase: false,
                locale: 'auto',
                multiline: 'last',
                noSortAlphabetically: false,
                reservedFirst: true,
                shorthandFirst: true,
            },
        ],
        'react/require-default-props': [0],

        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-case-declarations': 'off',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
