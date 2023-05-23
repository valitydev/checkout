import { PaymentTerminalFormValues } from 'checkout/state';
import { toContactInfo } from './to-contact-info';

describe('toContactInfo', () => {
    test('should return empty structure', () => {
        const initConfig = {};
        const formValues = {
            metadata: {}
        } as PaymentTerminalFormValues;

        const result = toContactInfo(initConfig, formValues);
        const expected = {
            email: undefined,
            phoneNumber: undefined
        };
        expect(result).toStrictEqual(expected);
    });

    test('should apply init config data', () => {
        const initConfig = {
            email: 'test@test.com',
            phoneNumber: '+79772223323'
        };
        const formValues = {
            metadata: {
                email: 'meta-email@test.com',
                phoneNumber: 'metaPhoneNumber'
            }
        } as PaymentTerminalFormValues;

        const result = toContactInfo(initConfig, formValues);
        const expected = {
            email: 'test@test.com',
            phoneNumber: '+79772223323'
        };
        expect(result).toStrictEqual(expected);
    });

    test('should apply form data', () => {
        const initConfig = {
            email: null,
            phoneNumber: null
        };
        const formValues = {
            metadata: {
                email: 'meta-email@test.com',
                phoneNumber: 'metaPhoneNumber'
            }
        } as PaymentTerminalFormValues;

        const result = toContactInfo(initConfig, formValues);
        const expected = {
            email: 'meta-email@test.com',
            phoneNumber: 'metaPhoneNumber'
        };
        expect(result).toStrictEqual(expected);
    });

    test('should apply form value email', () => {
        const initConfig = {
            email: null,
            phoneNumber: '+79772223323'
        };
        const formValues = {
            metadata: {
                email: 'meta-email@test.com',
                phoneNumber: 'metaPhoneNumber'
            }
        } as PaymentTerminalFormValues;

        const result = toContactInfo(initConfig, formValues);
        const expected = {
            email: 'meta-email@test.com',
            phoneNumber: '+79772223323'
        };
        expect(result).toStrictEqual(expected);
    });

    test('should apply form value phoneNumber', () => {
        const initConfig = {
            email: 'test@test.com',
            phoneNumber: null
        };
        const formValues = {
            metadata: {
                email: 'meta-email@test.com',
                phoneNumber: 'metaPhoneNumber'
            }
        } as PaymentTerminalFormValues;

        const result = toContactInfo(initConfig, formValues);
        const expected = {
            email: 'test@test.com',
            phoneNumber: 'metaPhoneNumber'
        };
        expect(result).toStrictEqual(expected);
    });
});
