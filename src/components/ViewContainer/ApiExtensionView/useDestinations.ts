import { useCallback, useReducer, useRef } from 'react';

import { BusinessError, Destination, getDestinations as getApiDestinations } from 'checkout/backend/p2p';
import { isNil, withRetry } from 'checkout/utils';

type State =
    | { status: 'PRISTINE' | 'LOADING' }
    | { status: 'SUCCESS'; data: Destination[] }
    | { status: 'FETCH_BUSINESS_ERROR'; error: BusinessError }
    | { status: 'FAILURE'; error: unknown };

type Action =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: Destination[] }
    | { type: 'FETCH_FAILURE'; error: unknown }
    | { type: 'FETCH_BUSINESS_ERROR'; payload: BusinessError };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, status: 'LOADING' };
        case 'FETCH_SUCCESS':
            return { status: 'SUCCESS', data: action.payload };
        case 'FETCH_BUSINESS_ERROR':
            return { status: 'FETCH_BUSINESS_ERROR', error: action.payload };
        case 'FETCH_FAILURE':
            return { status: 'FAILURE', error: action.error };
        default:
            return state;
    }
};

const isDestinations = (payload: Destination[] | BusinessError): payload is Destination[] => {
    return Array.isArray(payload);
};

const isBusinessError = (payload: Destination[] | BusinessError): payload is BusinessError => {
    if (isDestinations(payload)) return false;
    return !isNil(payload?.errorMessage);
};

export const useDestinations = (capiEndpoint: string, accessToken: string, invoiceID: string, paymentID: string) => {
    const [destinationsState, dispatch] = useReducer(reducer, {
        status: 'PRISTINE',
    });
    // In React dev mode, calling getDestinations twice in quick succession can lead to a 500 error.
    const lastGatewayIDRef = useRef<string | null>(null);

    const getDestinations = useCallback(
        async (gatewayID?: string) => {
            if (lastGatewayIDRef.current === gatewayID) {
                return;
            }
            lastGatewayIDRef.current = gatewayID;

            dispatch({ type: 'FETCH_START' });
            try {
                const getDestinationsWithRetry = withRetry(getApiDestinations);
                const destinationsOrBusinessError = await getDestinationsWithRetry(
                    capiEndpoint,
                    accessToken,
                    invoiceID,
                    paymentID,
                    gatewayID,
                );
                if (isDestinations(destinationsOrBusinessError)) {
                    dispatch({ type: 'FETCH_SUCCESS', payload: destinationsOrBusinessError });
                    return;
                }
                if (isBusinessError(destinationsOrBusinessError)) {
                    dispatch({ type: 'FETCH_BUSINESS_ERROR', payload: destinationsOrBusinessError });
                    return;
                }
                throw new Error('Unknown getDestinations response format.');
            } catch (error) {
                dispatch({ type: 'FETCH_FAILURE', error });
            }
        },
        [capiEndpoint, accessToken, invoiceID, paymentID],
    );

    return { destinationsState, getDestinations };
};
