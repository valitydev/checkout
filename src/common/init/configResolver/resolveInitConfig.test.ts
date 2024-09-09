import { resolveInitConfig } from './resolveInitConfig';
import { InitConfig } from '../types';

it('should return resolved init config', () => {
    const param = {
        invoiceID: 'someID',
        invoiceAccessToken: 'some token',
        obscureCardCvv: 'true',
        requireCardHolder: 'false',
        name: 'some name',
        description: 'some description',
        email: 'test@test.com',
        redirectUrl: 'some url',
    };

    const actual = resolveInitConfig(param as any);
    const expected: InitConfig = {
        integrationType: 'invoice',
        invoiceID: 'someID',
        invoiceAccessToken: 'some token',
        recurring: false,
        isExternalIDIncluded: true,
        locale: 'en',
        requireCardHolder: false,
        obscureCardCvv: true,
        email: 'test@test.com',
        description: 'some description',
        metadata: undefined,
        name: 'some name',
        phoneNumber: null,
        redirectUrl: null,
        skipUserInteraction: false,
        theme: null,
        paymentFlow: null,
    };
    expect(actual).toEqual(expected);
});
