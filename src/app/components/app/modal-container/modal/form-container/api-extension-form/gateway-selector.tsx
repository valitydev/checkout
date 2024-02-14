import { useEffect } from 'react';

import { Gateway } from 'checkout/backend';
import { Select } from 'checkout/components/ui';
import { useGateways } from 'checkout/hooks/p2p';
import { Locale } from 'checkout/locale';

export type GatewaySelectorProps = {
    locale: Locale;
    capiEndpoint: string;
    invoiceAccessToken: string;
    invoiceID: string;
    paymentID: string;
    onSelect: (gateway: Gateway | null) => void;
};

export const GatewaySelector = ({
    capiEndpoint,
    invoiceAccessToken,
    invoiceID,
    paymentID,
    locale,
    onSelect,
}: GatewaySelectorProps) => {
    const { state, getGateways } = useGateways(capiEndpoint, invoiceAccessToken, invoiceID, paymentID);

    useEffect(() => {
        getGateways();
    }, []);

    return (
        <>
            {state.status === 'PRISTINE' && <div>{locale['form.p2p.loading']}</div>}
            {state.status === 'FAILURE' && <div>{locale['form.p2p.error']}</div>}
            {state.status === 'SUCCESS' && (
                <Select
                    dirty={false}
                    error={false}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const found = state.data.find((gateway) => gateway.id === e.target.value);
                        onSelect(found);
                    }}
                >
                    <option value="">{locale['form.p2p.select.destination']}</option>
                    {state.data.map((gateway, i) => (
                        <option key={i} value={gateway.id}>
                            {gateway.name}
                        </option>
                    ))}
                </Select>
            )}
        </>
    );
};
