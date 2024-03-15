import { useEffect } from 'react';

import { Gateway } from 'checkout/backend/p2p';
import { Locale } from 'checkout/contexts';

import { useGateways } from './useGateways';
import { Select } from '../../../components/legacy';

export type GatewaySelectorProps = {
    locale: Locale;
    capiEndpoint: string;
    invoiceAccessToken: string;
    invoiceID: string;
    paymentID: string;
    onSelect: (gateway: Gateway | null) => void;
};

export const GatewaySelector = ({
    locale,
    capiEndpoint,
    invoiceAccessToken,
    invoiceID,
    paymentID,
    onSelect,
}: GatewaySelectorProps) => {
    const { state, getGateways } = useGateways(capiEndpoint, invoiceAccessToken, invoiceID, paymentID);

    useEffect(() => {
        getGateways();
    }, [getGateways]);

    useEffect(() => {
        if (state.status === 'SUCCESS' && state.data.length === 1) {
            onSelect(state.data[0]);
        }
    }, [state, onSelect]);

    return (
        <>
            {state.status === 'LOADING' && <div>{locale['form.p2p.loading']}</div>}
            {state.status === 'FAILURE' && <div>{locale['form.p2p.error']}</div>}
            {state.status === 'SUCCESS' && (
                <Select
                    dirty={false}
                    error={false}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const selectedGateway = state.data.find((gateway) => gateway.id === e.target.value);
                        onSelect(selectedGateway || null);
                    }}
                >
                    <option value="">{locale['form.p2p.select.destination']}</option>
                    {state.data.map((gateway) => (
                        <option key={gateway.id} value={gateway.id}>
                            {gateway.name}
                        </option>
                    ))}
                </Select>
            )}
        </>
    );
};
