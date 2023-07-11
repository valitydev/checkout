import { PaymentTerminalFormValues } from 'checkout/hooks';
import { PaymentMethodName } from '../init-app';
import { createPayment } from './create-payment';

const fetchMock = (result, status = 200) =>
    Promise.resolve({
        status,
        json: () => Promise.resolve(result)
    });

describe('createPayment', () => {
    const mockFetch = jest.fn().mockImplementation((args) => {
        if (args === 'https://api.test.com/v2/processing/payment-resources') {
            return fetchMock({});
        }
        if (args === 'https://shortener.test.com/v1/shortened-urls') {
            return fetchMock({
                shortenedUrl: 'https://shrt.empayre.com/6ut9gYaaMwH'
            });
        }
        if (args === 'https://api.test.com/v2/processing/invoices/1nLoSaB3UUU/payments') {
            return fetchMock({});
        }
        return Promise.reject('Mock function is not found');
    });

    global.fetch = mockFetch;

    test('should perform api calls', async () => {
        const params = {
            capiEndpoint: 'https://api.test.com',
            urlShortenerEndpoint: 'https://shortener.test.com',
            origin: 'https://origin.test.com',
            initConfig: {
                recurring: false,
                metadata: {
                    paymentMetaField: 'payment meta field'
                },
                isExternalIDIncluded: true,
                paymentFlowHold: false,
                redirectUrl: 'https://init.config.redirect.url',
                locale: null,
                email: 'test@test.com',
                phoneNumber: '+79774443411'
            },
            formData: {
                method: PaymentMethodName.PaymentTerminal,
                values: {
                    provider: 'provider ID',
                    paymentSessionInfo: {
                        redirectUrlInfo: {
                            type: 'self'
                        }
                    },
                    metadata: {
                        someField: 'test'
                    }
                } as PaymentTerminalFormValues
            },
            payableInvoice: {
                invoice: {
                    id: '1nLoSaB3UUU',
                    dueDate: '2023-05-22T13:47:47.444260Z',
                    externalID: 'Invoice external ID'
                },
                invoiceAccessToken: 'eyJhb...'
            }
        };

        await createPayment(params);

        expect(mockFetch).toHaveBeenCalledTimes(3);
        expect(mockFetch).toHaveBeenCalledWith(
            'https://api.test.com/v2/processing/payment-resources',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({
                    paymentTool: {
                        paymentToolType: 'PaymentTerminalData',
                        provider: 'provider ID',
                        metadata: {
                            someField: 'test'
                        }
                    },
                    clientInfo: {
                        fingerprint: 'userFingerprintTest'
                    }
                }),
                headers: expect.any(Object)
            })
        );
        expect(mockFetch).toHaveBeenCalledWith(
            'https://shortener.test.com/v1/shortened-urls',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({
                    sourceUrl:
                        'https://origin.test.com/v1/checkout.html?invoiceID=1nLoSaB3UUU&invoiceAccessToken=eyJhb...&redirectUrl=https%3A%2F%2Finit.config.redirect.url&skipUserInteraction=true',
                    expiresAt: '2023-05-22T13:47:47.444260Z'
                }),
                headers: expect.any(Object)
            })
        );
        expect(mockFetch).toHaveBeenCalledWith(
            'https://api.test.com/v2/processing/invoices/1nLoSaB3UUU/payments',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({
                    flow: {
                        type: 'PaymentFlowInstant'
                    },
                    payer: {
                        payerType: 'PaymentResourcePayer',
                        contactInfo: {
                            email: 'test@test.com',
                            phoneNumber: '+79774443411'
                        },
                        sessionInfo: {
                            redirectUrl: 'https://shrt.empayre.com/6ut9gYaaMwH'
                        }
                    },
                    makeRecurrent: false,
                    metadata: {
                        paymentMetaField: 'payment meta field'
                    },
                    externalID: 'Invoice external ID'
                }),
                headers: expect.any(Object)
            })
        );
    });
});
