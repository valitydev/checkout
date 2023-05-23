import { PaymentTerminalFormValues } from 'checkout/state';
import { toContactInfo } from './to-contact-info';

describe('toContactInfo', () => {
    test('should return empty object', () => {
        const initConfig = {
            someField1: 'someValue1'
        } as any;
        const formValues = {
            amount: 'test',
            metadata: {
                someField3: 'someValue1'
            }
        } as PaymentTerminalFormValues;

        const result = toContactInfo(initConfig, formValues);

        expect(result).toStrictEqual({});
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
            },
            email: 'form-email@test.com',
            phoneNumber: 'formPhoneNumber'
        } as PaymentTerminalFormValues;

        const result = toContactInfo(initConfig, formValues);
        expect(result).toStrictEqual(initConfig);
    });

    test('should apply metadata', () => {
        const initConfig = {
            email: null,
            phoneNumber: null
        };
        const formValues = {
            metadata: {
                email: 'meta-email@test.com',
                phoneNumber: 'metaPhoneNumber'
            },
            email: 'form-email@test.com',
            phoneNumber: 'formPhoneNumber'
        } as PaymentTerminalFormValues;

        const result = toContactInfo(initConfig, formValues);
        expect(result).toStrictEqual(formValues.metadata);
    });

    test('should apply metadata', () => {
        const initConfig = {
            email: null,
            phoneNumber: null
        };
        const formValues = {
            email: 'form-email@test.com',
            phoneNumber: 'formPhoneNumber'
        } as PaymentTerminalFormValues;

        const result = toContactInfo(initConfig, formValues);
        expect(result).toStrictEqual({
            email: 'form-email@test.com',
            phoneNumber: 'formPhoneNumber'
        });
    });

    test('should apply form value email', () => {
        const initConfig = {
            phoneNumber: '+79772223323'
        } as any;
        const formValues = {
            metadata: {
                email: 'meta-email@test.com',
                phoneNumber: 'metaPhoneNumber'
            },
            phoneNumber: 'formPhoneNumber'
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
            },
            email: 'form-email@test.com'
        } as PaymentTerminalFormValues;

        const result = toContactInfo(initConfig, formValues);
        const expected = {
            email: 'test@test.com',
            phoneNumber: 'metaPhoneNumber'
        };
        expect(result).toStrictEqual(expected);
    });

    test('should apply form value phoneNumber', () => {
        const initConfig = {} as any;
        const formValues = {
            email: 'form-email@test.com',
            phoneNumber: 'formPhoneNumber'
        } as PaymentTerminalFormValues;

        const result = toContactInfo(initConfig, formValues);

        expect(result).toStrictEqual(formValues);
    });

    test('should replace spaces', () => {
        const initConfig = {} as any;
        const formValues = {
            email: ' form-email@test.com',
            phoneNumber: 'formPhoneNumber '
        } as PaymentTerminalFormValues;

        const result = toContactInfo(initConfig, formValues);

        expect(result).toStrictEqual({
            email: 'form-email@test.com',
            phoneNumber: 'formPhoneNumber'
        });
    });
});
