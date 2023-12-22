import { useEffect } from 'react';

import { useDestinations } from 'checkout/hooks';
import isNil from 'checkout/utils/is-nil';

import { DestinationInfo } from './destination-info';

export type DestinationsProps = {
    capiEndpoint: string;
    invoiceAccessToken: string;
    invoiceID: string;
    paymentID: string;
    gatewayID: string;
    getDestinationsStatusChanged?: (status: string) => void;
};

export const Destinations = ({
    capiEndpoint,
    invoiceAccessToken,
    invoiceID,
    paymentID,
    gatewayID,
    getDestinationsStatusChanged,
}: DestinationsProps) => {
    const { state, getDestinations } = useDestinations(capiEndpoint, invoiceAccessToken, invoiceID, paymentID);

    useEffect(() => {
        getDestinations(gatewayID);
    }, [gatewayID]);

    useEffect(() => {
        if (isNil(getDestinationsStatusChanged)) return;
        getDestinationsStatusChanged(state.status);
    }, [state]);

    return (
        <>
            {state.status === 'LOADING' && <div>Loading...</div>}
            {state.status === 'FAILURE' && <div>An error ocurred</div>}
            {state.status === 'SUCCESS' &&
                state.data.map((destination, i) => <DestinationInfo key={i} destination={destination} />)}
        </>
    );
};
