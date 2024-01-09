import { HoldExpirationType } from 'checkout/backend';

import { resolveInitConfig } from './resolve-init-config';

it('should return resolved init config', () => {
    const param = {
        invoiceID: 'someID',
        invoiceAccessToken: 'some token',
        amount: '1000',
        obscureCardCvv: 'true',
        requireCardHolder: 'false',
        name: 'some name',
        description: 'some description',
        email: 'test@test.com',
        redirectUrl: 'some url',
    };

    const actual = resolveInitConfig(param as any);
    const expected = {
        integrationType: 'invoice',
        invoiceID: 'someID',
        invoiceAccessToken: 'some token',
        wallets: true,
        bankCard: true,
        brandless: true,
        paymentFlowHold: false,
        recurring: false,
        holdExpiration: HoldExpirationType.cancel,
        isExternalIDIncluded: false,
        locale: 'en',
        requireCardHolder: false,
        obscureCardCvv: true,
        amount: 1000,
        email: 'test@test.com',
        description: 'some description',
        metadata: undefined,
        name: 'some name',
        netBanking: true,
        onlineBanking: true,
        phoneNumber: null,
        pix: true,
        redirectUrl: null,
        skipUserInteraction: false,
        terminalBankCard: true,
        terminalFormValues: undefined,
        terminalWallets: true,
        upi: true,
    };
    expect(actual).toEqual(expected);
});
