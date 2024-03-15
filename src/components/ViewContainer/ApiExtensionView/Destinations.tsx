import { useEffect } from 'react';

import { DestinationInfo } from './DestinationInfo';
import { useDestinations } from './useDestinations';
import { Locale } from '../../../common/contexts';
import { isNil } from '../../../common/utils';

export type DestinationsProps = {
    locale: Locale;
    capiEndpoint: string;
    invoiceAccessToken: string;
    invoiceID: string;
    paymentID: string;
    gatewayID: string;
    getDestinationsStatusChanged?: (status: string) => void;
};

export const Destinations = ({
    locale,
    capiEndpoint,
    invoiceAccessToken,
    invoiceID,
    paymentID,
    gatewayID,
    getDestinationsStatusChanged,
}: DestinationsProps) => {
    const { state, getDestinations } = useDestinations(
        capiEndpoint,
        invoiceAccessToken,
        invoiceID,
        paymentID,
        gatewayID,
    );

    useEffect(() => {
        getDestinations();
    }, [gatewayID]);

    useEffect(() => {
        if (isNil(getDestinationsStatusChanged)) return;
        getDestinationsStatusChanged(state.status);
    }, [state]);

    return (
        <>
            {state.status === 'LOADING' && <div>{locale['form.p2p.loading']}</div>}
            {state.status === 'FAILURE' && <div>{locale['form.p2p.error']}</div>}
            {state.status === 'SUCCESS' &&
                state.data.map((destination, i) => (
                    <DestinationInfo key={i} destination={destination} locale={locale} />
                ))}
        </>
    );
};
