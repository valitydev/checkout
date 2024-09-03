import { useCallback, useReducer } from 'react';

import { BusinessError, Gateway, getGateways as getApiGateways } from 'checkout/backend/p2p';
import { extractError, isNil, withRetry } from 'checkout/utils';

type State =
    | { status: 'PRISTINE' | 'LOADING' }
    | { status: 'SUCCESS'; data: Gateway[] }
    | { status: 'BUSINESS_ERROR'; error: BusinessError }
    | { status: 'FAILURE'; error: unknown };

type Action =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: Gateway[] }
    | { type: 'FETCH_BUSINESS_ERROR'; payload: BusinessError }
    | { type: 'FETCH_FAILURE'; error: unknown };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'FETCH_START':
            return { status: 'LOADING' };
        case 'FETCH_SUCCESS':
            return { status: 'SUCCESS', data: action.payload };
        case 'FETCH_BUSINESS_ERROR':
            return { status: 'BUSINESS_ERROR', error: action.payload };
        case 'FETCH_FAILURE':
            return { status: 'FAILURE', error: action.error };
        default:
            return state;
    }
};

const isGateways = (payload: Gateway[] | BusinessError): payload is Gateway[] => {
    return Array.isArray(payload);
};

const isBusinessError = (payload: Gateway[] | BusinessError): payload is BusinessError => {
    if (isGateways(payload)) return false;
    return !isNil(payload?.errorMessage);
};

export const useGateways = (capiEndpoint: string, accessToken: string, invoiceID: string, paymentID: string) => {
    const [gatewaysState, dispatch] = useReducer(reducer, {
        status: 'PRISTINE',
    });

    const getGateways = useCallback(async () => {
        dispatch({ type: 'FETCH_START' });
        try {
            const getGatewaysWithRetry = withRetry(getApiGateways);
            const gatewaysOrBusinessError = await getGatewaysWithRetry(capiEndpoint, accessToken, invoiceID, paymentID);
            if (isGateways(gatewaysOrBusinessError)) {
                dispatch({ type: 'FETCH_SUCCESS', payload: gatewaysOrBusinessError });
                return;
            }
            if (isBusinessError(gatewaysOrBusinessError)) {
                dispatch({ type: 'FETCH_BUSINESS_ERROR', payload: gatewaysOrBusinessError });
                return;
            }
            throw new Error('Unknown getGateways response format.');
        } catch (error) {
            dispatch({ type: 'FETCH_FAILURE', error });
            console.error(`Failed to fetch gateways. ${extractError(error)}`);
        }
    }, [capiEndpoint, accessToken, invoiceID, paymentID]);

    return { gatewaysState, getGateways };
};
