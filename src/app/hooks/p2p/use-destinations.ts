import { useCallback, useReducer } from 'react';

import { Destination, getDestinations as getApiDestinations } from 'checkout/backend';

type State =
    | { status: 'PRISTINE' }
    | { status: 'LOADING' }
    | { status: 'SUCCESS'; data: Destination[] }
    | { status: 'FAILURE'; data: null; error: unknown };

type Action =
    | { type: 'GET_DESTINATIONS_INIT' }
    | { type: 'GET_DESTINATIONS_SUCCESS'; payload: Destination[] }
    | { type: 'GET_DESTINATIONS_FAILURE'; error: unknown };

const dataFetchReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'GET_DESTINATIONS_INIT':
            return {
                status: 'LOADING',
            };
        case 'GET_DESTINATIONS_SUCCESS':
            return {
                ...state,
                status: 'SUCCESS',
                data: action.payload,
            };
        case 'GET_DESTINATIONS_FAILURE':
            return {
                ...state,
                status: 'FAILURE',
                error: action.error,
                data: null,
            };
    }
};

export const useDestinations = (capiEndpoint: string, accessToken: string, invoiceID: string, paymentID: string) => {
    const [state, dispatch] = useReducer(dataFetchReducer, {
        status: 'PRISTINE',
    });

    const getDestinations = useCallback((gatewayID: string) => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'GET_DESTINATIONS_INIT' });
                const payload = await getApiDestinations(capiEndpoint, accessToken, invoiceID, paymentID, gatewayID);
                dispatch({
                    type: 'GET_DESTINATIONS_SUCCESS',
                    payload,
                });
            } catch (error) {
                dispatch({ type: 'GET_DESTINATIONS_FAILURE', error });
            }
        };
        fetchData();
    }, []);

    return { state, getDestinations };
};
