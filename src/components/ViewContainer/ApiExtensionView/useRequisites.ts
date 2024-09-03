import { useEffect, useReducer } from 'react';

import { Destination, Gateway } from 'checkout/backend/p2p';

import { useDestinations } from './useDestinations';
import { useGateways } from './useGateways';

type State =
    | { status: 'PRISTINE' | 'LOADING' | 'FAILURE' }
    | { status: 'REQUIRE_GATEWAY_SELECTION'; gateway: Gateway[] }
    | { status: 'READY'; destinations: Destination[] };

type Action =
    | { type: 'FETCH_START' }
    | { type: 'FETCHED_MULTI_GATEWAYS'; payload: Gateway[] }
    | { type: 'FETCHED_DESTINATIONS'; payload: Destination[] }
    | { type: 'FETCH_FAILURE' };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, status: 'LOADING' };
        case 'FETCHED_MULTI_GATEWAYS':
            return { ...state, status: 'REQUIRE_GATEWAY_SELECTION', gateway: action.payload };
        case 'FETCHED_DESTINATIONS':
            return { ...state, status: 'READY', destinations: action.payload };
        case 'FETCH_FAILURE':
            return { status: 'FAILURE' };
        default:
            return state;
    }
};

export const useRequisites = (
    apiEndpoint: string,
    invoiceAccessToken: string,
    invoiceID: string,
    paymentId: string,
) => {
    const [state, dispatch] = useReducer(reducer, {
        status: 'PRISTINE',
    });
    const { gatewaysState, getGateways } = useGateways(apiEndpoint, invoiceAccessToken, invoiceID, paymentId);
    const { destinationsState, getDestinations } = useDestinations(
        apiEndpoint,
        invoiceAccessToken,
        invoiceID,
        paymentId,
    );

    useEffect(() => {
        if (gatewaysState.status === 'SUCCESS') {
            if (gatewaysState.data.length === 1) {
                getDestinations(gatewaysState.data[0].id);
            }
            if (gatewaysState.data.length === 0) {
                getDestinations();
            }
            if (gatewaysState.data.length > 1) {
                dispatch({ type: 'FETCHED_MULTI_GATEWAYS', payload: gatewaysState.data });
            }
        }
        if (gatewaysState.status === 'FAILURE') {
            dispatch({ type: 'FETCH_FAILURE' });
        }
        if (gatewaysState.status === 'BUSINESS_ERROR') {
            console.error(`Failed to fetch gateways. Business Error: ${gatewaysState.error.errorMessage}`);
            dispatch({ type: 'FETCH_FAILURE' });
        }
    }, [gatewaysState]);

    useEffect(() => {
        if (destinationsState.status === 'SUCCESS') {
            dispatch({ type: 'FETCHED_DESTINATIONS', payload: destinationsState.data });
        }
        if (destinationsState.status === 'FAILURE') {
            dispatch({ type: 'FETCH_FAILURE' });
        }
    }, [destinationsState]);

    const start = () => {
        dispatch({ type: 'FETCH_START' });
        getGateways();
    };

    const setGateway = (gatewayID: string) => {
        dispatch({ type: 'FETCH_START' });
        getDestinations(gatewayID);
    };

    return { state, start, setGateway };
};
