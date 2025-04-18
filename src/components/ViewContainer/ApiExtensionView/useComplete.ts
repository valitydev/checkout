import { useCallback, useReducer } from 'react';

import { complete as completeApi, CompleteInfoAttachment } from 'checkout/backend/p2p';
import { extractError, withRetry } from 'checkout/utils';

type State = { status: 'PRISTINE' | 'LOADING' | 'SUCCESS' | 'FAILURE' };

type Action = { type: 'FETCH_START' | 'FETCH_SUCCESS' | 'FETCH_FAILURE' };

const dataFetchReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'FETCH_START':
            return {
                status: 'LOADING',
            };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                status: 'SUCCESS',
            };
        case 'FETCH_FAILURE':
            return {
                ...state,
                status: 'FAILURE',
            };
    }
};

export const useComplete = (capiEndpoint: string, accessToken: string, invoiceID: string, paymentID: string) => {
    const [completeState, dispatch] = useReducer(dataFetchReducer, {
        status: 'PRISTINE',
    });

    const complete = useCallback(
        async (attachment?: CompleteInfoAttachment) => {
            try {
                dispatch({ type: 'FETCH_START' });
                const completeWithRetry = withRetry(completeApi);
                await completeWithRetry(capiEndpoint, accessToken, {
                    invoiceId: invoiceID,
                    paymentId: paymentID,
                    attachment,
                });
                dispatch({
                    type: 'FETCH_SUCCESS',
                });
            } catch (error) {
                dispatch({ type: 'FETCH_FAILURE' });
                console.error(`Failed to p2p complete. ${extractError(error)}`);
            }
        },
        [capiEndpoint, accessToken, invoiceID, paymentID],
    );

    return { completeState, complete };
};
