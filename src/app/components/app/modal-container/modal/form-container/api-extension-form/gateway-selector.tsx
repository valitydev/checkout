import { useEffect } from 'react';
import styled from 'styled-components';

import { useGateways } from 'checkout/hooks/p2p';

import { Header } from '../header';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-height: 360px;
`;

export type GatewaySelectorProps = {
    capiEndpoint: string;
    invoiceAccessToken: string;
    invoiceID: string;
    paymentID: string;
};

export const GatewaySelector = ({ capiEndpoint, invoiceAccessToken, invoiceID, paymentID }: GatewaySelectorProps) => {
    const { state, getGateways } = useGateways(capiEndpoint, invoiceAccessToken, invoiceID, paymentID);

    useEffect(() => {
        getGateways();
    }, []);

    return (
        <Container>
            <Header title="Select gateway" />
            {state.status === 'PRISTINE' && <div>Loading...</div>}
            {state.status === 'FAILURE' && <div>An error ocurred</div>}
        </Container>
    );
};
