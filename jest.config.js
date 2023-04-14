/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^checkout/(.*)': '<rootDir>/src/app/$1'
    },
    testMatch: ['**/__tests__/**/*.test.ts'],
    transform: {
        '^.+\\.ts(x)?$': ['ts-jest', { useESM: true }]
    },
    extensionsToTreatAsEsm: ['.ts']
};
