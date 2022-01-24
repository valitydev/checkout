module.exports = {
    preset: 'ts-jest/presets/js-with-babel-esm',
    testEnvironment: 'jsdom',
    globals: {
        'ts-jest': {
            useESM: true
        }
    },
    testMatch: ['<rootDir>/src/**/?(*.)(spec|test).ts?(x)'],
    moduleNameMapper: {
        '^.+\\.scss$': 'identity-obj-proxy',
        '^checkout/(.*)': '<rootDir>/src/app/$1',
        '^lodash-es/(.*)$': 'lodash/$1'
    }
};
