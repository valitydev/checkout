import { InvoiceChangeType } from 'checkout/backend';

import { pollInvoiceEvents } from './pollInvoiceEvents';

const fetchValueMock = (result, status = 200, ok = true) => ({
    status,
    ok,
    json: async () => result,
});

describe('pollInvoiceEvents', () => {
    const invoiceID = '1dyg1GWgt22';
    const apiEndpoint = 'https://api.test.com';
    const params = {
        apiEndpoint,
        invoiceID,
        invoiceAccessToken: 'eyJhbGciOiJQUzI...',
        stopPollingTypes: [
            InvoiceChangeType.InvoiceStatusChanged,
            InvoiceChangeType.PaymentStatusChanged,
            InvoiceChangeType.PaymentInteractionRequested,
        ],
    };
    const getEventsUrl = (capiEndpoint: string, invoiceID: string, eventID?: number, limit = 20) => {
        const eventIDParam = eventID ? `&eventID=${eventID}` : '';
        return `${capiEndpoint}/v2/processing/invoices/${invoiceID}/events?limit=${limit}${eventIDParam}`;
    };

    describe('non specified eventID', () => {
        const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

        test('should return timeout result', async () => {
            const mockFetch = jest.fn();
            mockFetch.mockResolvedValue(fetchValueMock([]));
            global.fetch = mockFetch;

            const delays = {
                pollingTimeout: 300,
                apiMethodCall: 100,
            };
            const result = await pollInvoiceEvents({ ...params, delays });
            await delay(300); // for checking that after timeout there are no more api calls

            expect(mockFetch).toHaveBeenCalledTimes(4);

            const expected = {
                status: 'TIMEOUT',
            };
            expect(result).toStrictEqual(expected);
        });

        test('should return polled result', async () => {
            const mockFetch = jest.fn();
            mockFetch.mockResolvedValueOnce(
                fetchValueMock([
                    {
                        changes: [
                            {
                                changeType: 'InvoiceCreated',
                                invoice: 'invoice mock',
                            },
                        ],
                        createdAt: '2023-05-25T17:31:57.248146Z',
                        id: 1,
                    },
                    {
                        changes: [
                            {
                                changeType: 'PaymentStarted',
                                payment: 'payment mock',
                            },
                        ],
                        createdAt: '2023-05-25T17:31:58.442598Z',
                        id: 2,
                    },
                ]),
            );
            mockFetch.mockResolvedValueOnce(fetchValueMock([]));
            mockFetch.mockResolvedValueOnce(
                fetchValueMock([
                    {
                        changes: [
                            {
                                changeType: 'PaymentInteractionRequested',
                                paymentID: '1',
                                userInteraction: 'user interaction mock',
                            },
                        ],
                        createdAt: '2023-05-25T17:32:01.601868Z',
                        id: 7,
                    },
                ]),
            );
            global.fetch = mockFetch;

            const delays = {
                pollingTimeout: 100,
                apiMethodCall: 10,
            };
            const result = await pollInvoiceEvents({ ...params, delays });

            expect(mockFetch).toHaveBeenCalledTimes(3);
            expect(mockFetch).toHaveBeenCalledWith(getEventsUrl(apiEndpoint, invoiceID), expect.any(Object));
            expect(mockFetch).toHaveBeenCalledWith(getEventsUrl(apiEndpoint, invoiceID), expect.any(Object));
            expect(mockFetch).toHaveBeenCalledWith(getEventsUrl(apiEndpoint, invoiceID, 2), expect.any(Object));

            const expected = {
                status: 'POLLED',
                eventID: 7,
                change: {
                    changeType: 'PaymentInteractionRequested',
                    paymentID: '1',
                    userInteraction: 'user interaction mock',
                },
            };
            expect(result).toStrictEqual(expected);
        });
    });

    describe('specified eventID', () => {
        test('should return polled result', async () => {
            const mockFetch = jest.fn();
            mockFetch.mockResolvedValueOnce(
                fetchValueMock([
                    {
                        changes: ['someChange_01', 'someChange_02'],
                        createdAt: '2023-05-25T17:31:58.442598Z',
                        id: 19,
                    },
                ]),
            );
            mockFetch.mockResolvedValueOnce(fetchValueMock([]));
            mockFetch.mockResolvedValueOnce(
                fetchValueMock([
                    {
                        changes: [
                            'someChange_01',
                            'someChange_02',
                            {
                                changeType: 'PaymentInteractionRequested',
                                paymentID: '1',
                                userInteraction: 'user interaction mock',
                            },
                        ],
                        createdAt: '2023-05-25T17:32:01.601868Z',
                        id: 21,
                    },
                ]),
            );
            global.fetch = mockFetch;

            const delays = {
                pollingTimeout: 100,
                apiMethodCall: 10,
            };
            const result = await pollInvoiceEvents({
                ...params,
                delays,
                ...{ eventID: 15 },
            });

            expect(mockFetch).toHaveBeenCalledTimes(3);
            expect(mockFetch).toHaveBeenCalledWith(getEventsUrl(apiEndpoint, invoiceID, 15), expect.any(Object));
            expect(mockFetch).toHaveBeenCalledWith(getEventsUrl(apiEndpoint, invoiceID, 19), expect.any(Object));
            expect(mockFetch).toHaveBeenCalledWith(getEventsUrl(apiEndpoint, invoiceID, 19), expect.any(Object));

            const expected = {
                status: 'POLLED',
                eventID: 21,
                change: {
                    changeType: 'PaymentInteractionRequested',
                    paymentID: '1',
                    userInteraction: 'user interaction mock',
                },
            };
            expect(result).toStrictEqual(expected);
        });
    });
});
