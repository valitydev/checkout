/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        '^checkout/(.*)$': '<rootDir>/src/common/$1',
    },
};
