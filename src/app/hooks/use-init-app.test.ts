import { act, renderHook } from '@testing-library/react';

import { useInitApp } from './use-init-app';
import { PaymentMethodName } from 'checkout/backend';

const fetchMock = (result, status = 200, ok = true) =>
    Promise.resolve({
        status,
        ok,
        json: () => Promise.resolve(result),
    });

const getLocaleMock = fetchMock({
    'mock.locale.key': 'Mock locale value',
});

describe('useInitApp', () => {
    const getServiceProviderByIdMock_001 = fetchMock({
        brandName: 'Provider Brand Name 1',
        category: 'onlinebanking',
        id: 'providerID_001',
        metadata: {
            'dev.vality.checkout': {},
        },
    });

    const getServiceProviderByIdMock_002 = fetchMock({
        brandName: 'Provider Brand Name 2',
        category: 'pix',
        id: 'providerID_002',
        metadata: {
            'dev.vality.checkout': {},
        },
    });

    describe('init with invoice template', () => {
        const getInvoiceTemplateMock = fetchMock({
            createdAt: '2023-05-10T08:34:22.263596Z',
            details: {
                price: {
                    amount: 100,
                    costType: 'InvoiceTemplateLineCostFixed',
                    currency: 'USD',
                },
                product: 'test',
                templateType: 'InvoiceTemplateSingleLine',
            },
            id: '1n1ELRnJcBP',
            lifetime: { days: 21, months: 5, years: 0 },
            shopID: '000rrrrr-0000-0000-0000-45388402c928',
        });

        const getInvoicePaymentMethodsByTemplateIdMock = fetchMock([
            {
                method: PaymentMethodName.BankCard,
            },
            {
                method: PaymentMethodName.PaymentTerminal,
                providers: ['providerID_001', 'providerID_002'],
            },
        ]);

        test('should success init', async () => {
            global.fetch = jest.fn().mockImplementation((args) => {
                if (args.includes('/locale')) {
                    return getLocaleMock;
                }
                if (args === 'https://api.test.com/v2/processing/invoice-templates/1n1ELRnJcBP') {
                    return getInvoiceTemplateMock;
                }
                if (args === 'https://api.test.com/v2/processing/invoice-templates/1n1ELRnJcBP/payment-methods') {
                    return getInvoicePaymentMethodsByTemplateIdMock;
                }
                if (args === 'https://api.test.com/v2/processing/service-providers/providerID_001') {
                    return getServiceProviderByIdMock_001;
                }
                if (args === 'https://api.test.com/v2/processing/service-providers/providerID_002') {
                    return getServiceProviderByIdMock_002;
                }
                return Promise.reject('Mock function is not found');
            });

            const { result } = renderHook(() => useInitApp());
            expect(result.current.state.status).toBe('PRISTINE');

            await act(async () =>
                result.current.init({
                    appConfig: {
                        capiEndpoint: 'https://api.test.com',
                    },
                    initConfig: {
                        integrationType: 'invoiceTemplate',
                        invoiceTemplateID: '1n1ELRnJcBP',
                        invoiceTemplateAccessToken: 'eyJhbGciOiJ...',
                        locale: 'en',
                        bankCard: true,
                        onlineBanking: true,
                        pix: true,
                    },
                    origin: 'https://checkout.test.com',
                }),
            );
            const state = result.current.state;
            expect(state.status).toBe('SUCCESS');

            if (state.status !== 'SUCCESS') return;
            const expected = {
                initConfig: {
                    integrationType: 'invoiceTemplate',
                    invoiceTemplateID: '1n1ELRnJcBP',
                    invoiceTemplateAccessToken: 'eyJhbGciOiJ...',
                    locale: 'en',
                    bankCard: true,
                    onlineBanking: true,
                    pix: true,
                },
                appConfig: { capiEndpoint: 'https://api.test.com' },
                origin: 'https://checkout.test.com',
                locale: { 'mock.locale.key': 'Mock locale value' },
                model: {
                    paymentMethods: [
                        { method: 'BankCard' },
                        {
                            method: 'PaymentTerminal',
                            providers: ['providerID_001', 'providerID_002'],
                        },
                    ],
                    invoiceTemplate: {
                        createdAt: '2023-05-10T08:34:22.263596Z',
                        details: {
                            price: {
                                amount: 100,
                                costType: 'InvoiceTemplateLineCostFixed',
                                currency: 'USD',
                            },
                            product: 'test',
                            templateType: 'InvoiceTemplateSingleLine',
                        },
                        id: '1n1ELRnJcBP',
                        lifetime: { days: 21, months: 5, years: 0 },
                        shopID: '000rrrrr-0000-0000-0000-45388402c928',
                    },
                    serviceProviders: [
                        {
                            brandName: 'Provider Brand Name 1',
                            category: 'onlinebanking',
                            id: 'providerID_001',
                            metadata: { 'dev.vality.checkout': {} },
                        },
                        {
                            brandName: 'Provider Brand Name 2',
                            category: 'pix',
                            id: 'providerID_002',
                            metadata: { 'dev.vality.checkout': {} },
                        },
                    ],
                },
                amountInfo: {
                    status: 'final',
                    minorValue: 100,
                    currencyCode: 'USD',
                    locale: 'en',
                },
                availablePaymentMethods: [
                    { name: 'BankCard', priority: 1 },
                    {
                        name: 'PaymentTerminal',
                        category: 'onlinebanking',
                        serviceProviders: [
                            {
                                brandName: 'Provider Brand Name 1',
                                category: 'onlinebanking',
                                id: 'providerID_001',
                                metadata: { 'dev.vality.checkout': {} },
                            },
                        ],
                        priority: 3,
                    },
                    {
                        name: 'PaymentTerminal',
                        category: 'pix',
                        serviceProviders: [
                            {
                                brandName: 'Provider Brand Name 2',
                                category: 'pix',
                                id: 'providerID_002',
                                metadata: { 'dev.vality.checkout': {} },
                            },
                        ],
                        priority: 7,
                    },
                ],
            };

            expect(state.data).toStrictEqual(expected);
        });

        test('should failure init', async () => {
            const errorMsg = 'API error example';
            const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const mockFetch = jest.fn();
            mockFetch.mockResolvedValue(fetchMock(errorMsg, 500, false));
            global.fetch = mockFetch;

            const { result } = renderHook(() => useInitApp());
            expect(result.current.state.status).toBe('PRISTINE');

            await act(async () =>
                result.current.init({
                    appConfig: {
                        capiEndpoint: 'https://api.test.com',
                    },
                    initConfig: {
                        integrationType: 'invoiceTemplate',
                        invoiceTemplateID: '1n1ELRnJcBP',
                        invoiceTemplateAccessToken: 'eyJhbGciOiJ...',
                        locale: 'en',
                        bankCard: true,
                        onlineBanking: true,
                        pix: true,
                    },
                    origin: 'https://checkout.test.com',
                }),
            );
            const state = result.current.state;
            expect(state.status).toBe('FAILURE');
            expect(errorSpy).toHaveBeenCalled();
            if (state.status !== 'FAILURE') return;
            expect(state.error).toStrictEqual({
                details: errorMsg,
                status: 500,
                statusText: undefined,
            });
        });
    });

    describe('init with invoice', () => {
        const invoice = {
            amount: 100000,
            cart: [{ cost: 100000, price: 100000, product: 'test', quantity: 1 }],
            createdAt: '2023-05-11T12:14:44.001097Z',
            currency: 'RUB',
            description: '',
            dueDate: '2023-05-30T23:59:59Z',
            id: '1n3RrpQQQ1g',
            metadata: {},
            product: 'test',
            shopID: 'cb323cb7-2abc-4626-a786-b70d8abbd0ec',
            status: 'unpaid',
        };

        const getInvoiceMock = fetchMock(invoice);

        const getInvoicePaymentMethodsByTemplateIdMock = fetchMock([
            {
                method: PaymentMethodName.BankCard,
            },
            {
                method: PaymentMethodName.PaymentTerminal,
                providers: ['providerID_001', 'providerID_002'],
            },
        ]);

        test('should success init', async () => {
            global.fetch = jest.fn().mockImplementation((args) => {
                if (args.includes('/locale')) {
                    return getLocaleMock;
                }
                if (args === 'https://api.test.com/v2/processing/invoices/1n3RrpQQQ1g') {
                    return getInvoiceMock;
                }
                if (args === 'https://api.test.com/v2/processing/invoices/1n3RrpQQQ1g/payment-methods') {
                    return getInvoicePaymentMethodsByTemplateIdMock;
                }
                if (args === 'https://api.test.com/v2/processing/service-providers/providerID_001') {
                    return getServiceProviderByIdMock_001;
                }
                if (args === 'https://api.test.com/v2/processing/service-providers/providerID_002') {
                    return getServiceProviderByIdMock_002;
                }
                return Promise.reject('Mock function is not found');
            });

            const { result } = renderHook(() => useInitApp());
            expect(result.current.state.status).toBe('PRISTINE');

            await act(async () =>
                result.current.init({
                    appConfig: {
                        capiEndpoint: 'https://api.test.com',
                    },
                    initConfig: {
                        integrationType: 'invoice',
                        invoiceID: '1n3RrpQQQ1g',
                        invoiceAccessToken: 'eyJhbGciOiJ...',
                        locale: 'en',
                        bankCard: true,
                        onlineBanking: true,
                        pix: true,
                    },
                    origin: 'https://checkout.test.com',
                }),
            );
            const state = result.current.state;
            expect(state.status).toBe('SUCCESS');

            if (state.status !== 'SUCCESS') return;
            const expected = {
                initConfig: {
                    integrationType: 'invoice',
                    invoiceID: '1n3RrpQQQ1g',
                    invoiceAccessToken: 'eyJhbGciOiJ...',
                    locale: 'en',
                    bankCard: true,
                    onlineBanking: true,
                    pix: true,
                },
                appConfig: { capiEndpoint: 'https://api.test.com' },
                origin: 'https://checkout.test.com',
                locale: { 'mock.locale.key': 'Mock locale value' },
                model: {
                    paymentMethods: [
                        { method: 'BankCard' },
                        {
                            method: 'PaymentTerminal',
                            providers: ['providerID_001', 'providerID_002'],
                        },
                    ],
                    invoice: {
                        amount: 100000,
                        cart: [
                            {
                                cost: 100000,
                                price: 100000,
                                product: 'test',
                                quantity: 1,
                            },
                        ],
                        createdAt: '2023-05-11T12:14:44.001097Z',
                        currency: 'RUB',
                        description: '',
                        dueDate: '2023-05-30T23:59:59Z',
                        id: '1n3RrpQQQ1g',
                        metadata: {},
                        product: 'test',
                        shopID: 'cb323cb7-2abc-4626-a786-b70d8abbd0ec',
                        status: 'unpaid',
                    },
                    serviceProviders: [
                        {
                            brandName: 'Provider Brand Name 1',
                            category: 'onlinebanking',
                            id: 'providerID_001',
                            metadata: { 'dev.vality.checkout': {} },
                        },
                        {
                            brandName: 'Provider Brand Name 2',
                            category: 'pix',
                            id: 'providerID_002',
                            metadata: { 'dev.vality.checkout': {} },
                        },
                    ],
                    invoiceAccessToken: 'eyJhbGciOiJ...',
                },
                amountInfo: {
                    status: 'final',
                    minorValue: 100000,
                    currencyCode: 'RUB',
                    locale: 'en',
                },
                availablePaymentMethods: [
                    { name: 'BankCard', priority: 1 },
                    {
                        name: 'PaymentTerminal',
                        category: 'onlinebanking',
                        serviceProviders: [
                            {
                                brandName: 'Provider Brand Name 1',
                                category: 'onlinebanking',
                                id: 'providerID_001',
                                metadata: { 'dev.vality.checkout': {} },
                            },
                        ],
                        priority: 3,
                    },
                    {
                        name: 'PaymentTerminal',
                        category: 'pix',
                        serviceProviders: [
                            {
                                brandName: 'Provider Brand Name 2',
                                category: 'pix',
                                id: 'providerID_002',
                                metadata: { 'dev.vality.checkout': {} },
                            },
                        ],
                        priority: 7,
                    },
                ],
            };

            expect(state.data).toStrictEqual(expected);
        });
    });
});
