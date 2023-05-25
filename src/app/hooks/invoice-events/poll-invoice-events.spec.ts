import { InvoiceChangeType } from 'checkout/backend';
import { pollInvoiceEvents } from './poll-invoice-events';

const fetchValueMock = (result, status = 200) => ({
    status,
    json: async () => result
});

describe('pollInvoiceEvents', () => {
    const params = {
        capiEndpoint: 'https://api.test.com',
        invoiceID: '1dyg1GWgt22',
        invoiceAccessToken: 'eyJhbGciOiJQUzI...'
    };

    const POLLING_TIMEOUT_MS = 60 * 1000;

    test('should do something', async () => {
        const mockFetch = jest.fn();
        mockFetch.mockResolvedValueOnce(
            fetchValueMock([
                {
                    changes: [
                        {
                            changeType: 'InvoiceCreated',
                            invoice: 'invoice mock'
                        }
                    ],
                    createdAt: '2023-05-25T17:31:57.248146Z',
                    id: 1
                },
                {
                    changes: [
                        {
                            changeType: 'PaymentStarted',
                            payment: 'payment mock'
                        }
                    ],
                    createdAt: '2023-05-25T17:31:58.442598Z',
                    id: 2
                }
            ])
        );

        mockFetch.mockResolvedValueOnce(
            fetchValueMock([
                {
                    changes: [
                        {
                            changeType: 'PaymentInteractionRequested',
                            paymentID: '1',
                            userInteraction: 'user interaction mock'
                        }
                    ],
                    createdAt: '2023-05-25T17:32:01.601868Z',
                    id: 7
                }
            ])
        );
        global.fetch = mockFetch;

        const pollingContext = {
            stopPollingTypes: [
                InvoiceChangeType.InvoiceStatusChanged,
                InvoiceChangeType.PaymentStatusChanged,
                InvoiceChangeType.PaymentInteractionRequested
            ],
            pollingTimeoutMs: POLLING_TIMEOUT_MS
        };
        const result = await pollInvoiceEvents(params, pollingContext);
        const expected = {
            status: 'POLLED',
            eventID: 7,
            change: {
                changeType: 'PaymentInteractionRequested',
                paymentID: '1',
                userInteraction: 'user interaction mock'
            }
        };
        expect(result).toStrictEqual(expected);
    });
});
