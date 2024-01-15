import { useCallback, useReducer } from 'react';

import { Gateway, getGateways as getApiGateways } from 'checkout/backend';

type State =
    | { status: 'PRISTINE' }
    | { status: 'SUCCESS'; data: Gateway[] }
    | { status: 'FAILURE'; data: null; error: unknown };

type Action = { type: 'GET_GATEWAYS_SUCCESS'; payload: Gateway[] } | { type: 'GET_GATEWAYS_FAILURE'; error: unknown };

const dataFetchReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'GET_GATEWAYS_SUCCESS':
            return {
                ...state,
                status: 'SUCCESS',
                data: action.payload,
            };
        case 'GET_GATEWAYS_FAILURE':
            return {
                ...state,
                status: 'FAILURE',
                error: action.error,
                data: null,
            };
    }
};

export const useGateways = (capiEndpoint: string, accessToken: string, invoiceID: string, paymentID: string) => {
    const [state, dispatch] = useReducer(dataFetchReducer, {
        status: 'PRISTINE',
    });

    const getGateways = useCallback(() => {
        const fetchData = async () => {
            try {
                const payload = await getApiGateways(capiEndpoint, accessToken, invoiceID, paymentID);
                dispatch({
                    type: 'GET_GATEWAYS_SUCCESS',
                    payload,
                });
            } catch (error) {
                dispatch({ type: 'GET_GATEWAYS_FAILURE', error });
            }
        };
        fetchData();
    }, []);

    return { state, getGateways };
};
