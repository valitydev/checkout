import guid from 'checkout/utils/guid';

export type CompleteInfo = {
    invoiceId: string;
    paymentId: string;
    payerTransactionId?: string;
};

export const complete = async (capiEndpoint: string, accessToken: string, info: CompleteInfo): Promise<void> => {
    try {
        const response = await fetch(`${capiEndpoint}/p2p/payments/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${accessToken}`,
                'X-Request-ID': guid(),
            },
            body: JSON.stringify(info),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} Endpoint: ${capiEndpoint}/p2p/payments/complete`);
        }
    } catch (error) {
        if (error instanceof Error) {
            // Handle network errors or other unexpected issues
            throw new Error(`Network or unexpected error during the API request to ${capiEndpoint}: ${error.message}`);
        }
        // Fallback for non-Error exceptions
        throw new Error(`An unexpected error occurred during the API request to ${capiEndpoint}.`);
    }
};
