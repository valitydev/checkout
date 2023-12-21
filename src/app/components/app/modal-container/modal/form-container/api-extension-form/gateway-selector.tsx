import { useEffect } from 'react';

import { Gateway } from 'checkout/backend';
import { Select } from 'checkout/components/ui';
import { useGateways } from 'checkout/hooks/p2p';

export type GatewaySelectorProps = {
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
    onSelect,
}: GatewaySelectorProps) => {
    const { state, getGateways } = useGateways(capiEndpoint, invoiceAccessToken, invoiceID, paymentID);

    useEffect(() => {
        getGateways();
    }, []);

    return (
        <>
            {state.status === 'PRISTINE' && <div>Loading...</div>}
            {state.status === 'FAILURE' && <div>An error ocurred</div>}
            {state.status === 'SUCCESS' && (
                <Select dirty={false} error={false}>
                    <option value="" onClick={() => onSelect(null)}>
                        Select gateway...
                    </option>
                    {state.data.map((gateway, i) => (
                        <option key={i} value={gateway.id} onClick={() => onSelect(gateway)}>
                            {gateway.name}
                        </option>
                    ))}
                </Select>
            )}
        </>
    );
};
