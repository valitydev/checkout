import { PaymentMethodName } from 'checkout/backend';
import { createSessionInfo } from './create-session-info';
import { PaymentTerminalFormValues } from 'checkout/state';

const fetchMock = (result, status = 200) =>
    Promise.resolve({
        status,
        json: () => Promise.resolve(result)
    });

describe('createSessionInfo', () => {
    const mockFetch = jest.fn().mockImplementation((args) => {
        if (args === 'https://shortener.test.com/v1/shortened-urls') {
            return fetchMock({
                shortenedUrl: 'https://shrt.empayre.com/6ut9gYaaMwH'
            });
        }
        return Promise.reject('Mock function is not found');
    });

    global.fetch = mockFetch;

    afterEach(() => {
        mockFetch.mockClear();
    });

    const urlShortenerEndpoint = 'https://shortener.test.com';
    const origin = 'https://origin.test.com';
    const initConfigRedirectUrl = 'https://init.config.redirect.url';
    const invoiceData = {
        invoice: {
            id: '1nLoSaB3UUU',
            dueDate: '2023-05-22T13:47:47.444260Z',
            externalID: 'Invoice external ID'
        },
        invoiceAccessToken: 'eyJhb...'
    };

    const shortenerCallBody = (skipUserInteraction) =>
        expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
                sourceUrl: `https://origin.test.com/v1/checkout.html?invoiceID=1nLoSaB3UUU&invoiceAccessToken=eyJhb...&redirectUrl=https%3A%2F%2Finit.config.redirect.url&skipUserInteraction=${skipUserInteraction}`,
                expiresAt: '2023-05-22T13:47:47.444260Z'
            }),
            headers: expect.any(Object)
        });

    describe('method payment terminal', () => {
        const skipUserInteraction = true;

        describe('specified paymentSessionInfo', () => {
            describe('redirectUrlInfo self', () => {
                const formValues = {
                    method: PaymentMethodName.PaymentTerminal,
                    values: {
                        paymentSessionInfo: {
                            redirectUrlInfo: {
                                type: 'self'
                            }
                        }
                    } as PaymentTerminalFormValues
                };

                test('should shorten with initConfigRedirectUrl', async () => {
                    const result = await createSessionInfo(
                        urlShortenerEndpoint,
                        origin,
                        initConfigRedirectUrl,
                        invoiceData,
                        formValues
                    );
                    expect(result).toStrictEqual({
                        redirectUrl: 'https://shrt.empayre.com/6ut9gYaaMwH'
                    });
                    expect(mockFetch).toHaveBeenCalledTimes(1);
                    expect(mockFetch).toHaveBeenCalledWith(
                        'https://shortener.test.com/v1/shortened-urls',
                        shortenerCallBody(skipUserInteraction)
                    );
                });

                test('nullable initConfigRedirectUrl should shorten without initConfigRedirectUrl', async () => {
                    const nullInitConfigRedirectUrl = null;
                    const result = await createSessionInfo(
                        urlShortenerEndpoint,
                        origin,
                        nullInitConfigRedirectUrl,
                        invoiceData,
                        formValues
                    );
                    expect(result).toStrictEqual({
                        redirectUrl: 'https://shrt.empayre.com/6ut9gYaaMwH'
                    });
                    expect(mockFetch).toHaveBeenCalledTimes(1);
                    expect(mockFetch).toHaveBeenCalledWith(
                        'https://shortener.test.com/v1/shortened-urls',
                        expect.objectContaining({
                            method: 'POST',
                            body: JSON.stringify({
                                sourceUrl: `https://origin.test.com/v1/checkout.html?invoiceID=1nLoSaB3UUU&invoiceAccessToken=eyJhb...&skipUserInteraction=${skipUserInteraction}`,
                                expiresAt: '2023-05-22T13:47:47.444260Z'
                            }),
                            headers: expect.any(Object)
                        })
                    );
                });
            });

            describe('redirectUrlInfo outer', () => {
                const formValues = {
                    method: PaymentMethodName.PaymentTerminal,
                    values: {
                        paymentSessionInfo: {
                            redirectUrlInfo: {
                                type: 'outer'
                            }
                        }
                    } as PaymentTerminalFormValues
                };

                test('should return initConfigRedirectUrl and do not shorten', async () => {
                    const result = await createSessionInfo(
                        urlShortenerEndpoint,
                        origin,
                        initConfigRedirectUrl,
                        invoiceData,
                        formValues
                    );
                    expect(result).toStrictEqual({
                        redirectUrl: 'https://init.config.redirect.url'
                    });
                    expect(mockFetch).toHaveBeenCalledTimes(0);
                });

                test('nullable initConfigRedirectUrl should shorten without initConfigRedirectUrl', async () => {
                    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
                    const nullInitConfigRedirectUrl = null;
                    const result = await createSessionInfo(
                        urlShortenerEndpoint,
                        origin,
                        nullInitConfigRedirectUrl,
                        invoiceData,
                        formValues
                    );
                    expect(result).toStrictEqual({
                        redirectUrl: 'https://shrt.empayre.com/6ut9gYaaMwH'
                    });
                    expect(mockFetch).toHaveBeenCalledTimes(1);
                    expect(mockFetch).toHaveBeenCalledWith(
                        'https://shortener.test.com/v1/shortened-urls',
                        expect.objectContaining({
                            method: 'POST',
                            body: JSON.stringify({
                                sourceUrl: `https://origin.test.com/v1/checkout.html?invoiceID=1nLoSaB3UUU&invoiceAccessToken=eyJhb...&skipUserInteraction=${skipUserInteraction}`,
                                expiresAt: '2023-05-22T13:47:47.444260Z'
                            }),
                            headers: expect.any(Object)
                        })
                    );
                    expect(errorSpy).toHaveBeenCalled();
                });
            });
        });

        test('redirect url info is not specified', async () => {
            const formValues = {
                method: PaymentMethodName.PaymentTerminal,
                values: {}
            };

            const result = await createSessionInfo(
                urlShortenerEndpoint,
                origin,
                initConfigRedirectUrl,
                invoiceData,
                formValues
            );
            expect(result).toStrictEqual({
                redirectUrl: 'https://shrt.empayre.com/6ut9gYaaMwH'
            });
            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(mockFetch).toHaveBeenCalledWith(
                'https://shortener.test.com/v1/shortened-urls',
                shortenerCallBody(skipUserInteraction)
            );
        });

        test('redirect url info is partial specified', async () => {
            const formValues = {
                method: PaymentMethodName.PaymentTerminal,
                values: {
                    paymentSessionInfo: {}
                } as PaymentTerminalFormValues
            };

            const result = await createSessionInfo(
                urlShortenerEndpoint,
                origin,
                initConfigRedirectUrl,
                invoiceData,
                formValues
            );
            expect(result).toStrictEqual({
                redirectUrl: 'https://shrt.empayre.com/6ut9gYaaMwH'
            });
            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(mockFetch).toHaveBeenCalledWith(
                'https://shortener.test.com/v1/shortened-urls',
                shortenerCallBody(skipUserInteraction)
            );
        });
    });

    describe('bank card method', () => {
        const skipUserInteraction = false;

        test('should shorten redirect url with false skipUserInteraction', async () => {
            const formValues = {
                method: PaymentMethodName.BankCard
            };

            const result = await createSessionInfo(
                urlShortenerEndpoint,
                origin,
                initConfigRedirectUrl,
                invoiceData,
                formValues
            );
            expect(result).toStrictEqual({
                redirectUrl: 'https://shrt.empayre.com/6ut9gYaaMwH'
            });
            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(mockFetch).toHaveBeenCalledWith(
                'https://shortener.test.com/v1/shortened-urls',
                shortenerCallBody(skipUserInteraction)
            );
        });
    });

    describe('digital wallet method', () => {
        const skipUserInteraction = false;

        test('should shorten redirect url with false skipUserInteraction', async () => {
            const formValues = {
                method: PaymentMethodName.DigitalWallet
            };

            const result = await createSessionInfo(
                urlShortenerEndpoint,
                origin,
                initConfigRedirectUrl,
                invoiceData,
                formValues
            );
            expect(result).toStrictEqual({
                redirectUrl: 'https://shrt.empayre.com/6ut9gYaaMwH'
            });
            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(mockFetch).toHaveBeenCalledWith(
                'https://shortener.test.com/v1/shortened-urls',
                shortenerCallBody(skipUserInteraction)
            );
        });
    });
});
