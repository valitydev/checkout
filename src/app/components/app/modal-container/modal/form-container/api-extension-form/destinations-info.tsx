import { useEffect } from 'react';

import { useDestinations } from 'checkout/hooks';

export type DestinationsInfoProps = {
    capiEndpoint: string;
    invoiceAccessToken: string;
    invoiceID: string;
    paymentID: string;
    gatewayID: string;
};

export const DestinationsInfo = ({
    capiEndpoint,
    invoiceAccessToken,
    invoiceID,
    paymentID,
    gatewayID,
}: DestinationsInfoProps) => {
    const { state, getDestinations } = useDestinations(capiEndpoint, invoiceAccessToken, invoiceID, paymentID);

    useEffect(() => {
        getDestinations(gatewayID);
    }, [gatewayID]);

    return (
        <>
            {state.status === 'LOADING' && <div>Loading...</div>}
            {state.status === 'FAILURE' && <div>An error ocurred</div>}
            {state.status === 'SUCCESS' && <div>Success</div>}
        </>
    );
};
