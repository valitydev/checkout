import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Gateway } from 'checkout/backend';
import { ApiExtensionFormInfo } from 'checkout/hooks';
import isNil from 'checkout/utils/is-nil';

import { DestinationsInfo } from './destinations-info';
import { GatewaySelector } from './gateway-selector';
import { InitialContext } from '../../../../initial-context';
import { ModalContext } from '../../../modal-context';
import { PayableInvoiceContext } from '../../../payable-invoice-context';
import { Header } from '../header';
import { useActiveModalForm } from '../use-active-modal-form';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-height: 360px;
`;

const ApiExtensionForm = ({ onMount }: { onMount: () => void }) => {
    const {
        payableInvoiceData: { invoiceAccessToken, invoice },
    } = useContext(PayableInvoiceContext);
    const { appConfig } = useContext(InitialContext);
    const { modalState } = useContext(ModalContext);
    const { paymentID } = useActiveModalForm<ApiExtensionFormInfo>(modalState);

    const [gateway, setGateway] = useState<Gateway | null>(null);

    useEffect(() => {
        onMount();
    }, []);

    return (
        <Container>
            <Header title="P2P" />
            <GatewaySelector
                capiEndpoint={appConfig.capiEndpoint}
                invoiceAccessToken={invoiceAccessToken}
                invoiceID={invoice.id}
                paymentID={paymentID}
                onSelect={setGateway}
            ></GatewaySelector>
            {!isNil(gateway) && (
                <DestinationsInfo
                    capiEndpoint={appConfig.capiEndpoint}
                    gatewayID={gateway?.id}
                    invoiceAccessToken={invoiceAccessToken}
                    invoiceID={invoice.id}
                    paymentID={paymentID}
                ></DestinationsInfo>
            )}
        </Container>
    );
};

export default ApiExtensionForm;
