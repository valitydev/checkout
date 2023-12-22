import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Gateway } from 'checkout/backend';
import { Button } from 'checkout/components/ui';
import { ApiExtensionFormInfo, useComplete } from 'checkout/hooks';
import isNil from 'checkout/utils/is-nil';

import { Destinations } from './destinations';
import { GatewaySelector } from './gateway-selector';
import { InitialContext } from '../../../../initial-context';
import { ModalContext } from '../../../modal-context';
import { PayableInvoiceContext } from '../../../payable-invoice-context';
import { Header } from '../header';
import { useActiveModalForm } from '../use-active-modal-form';

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-height: 360px;
    justify-content: space-between;
`;

const SelectorContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const ApiExtensionForm = ({ onMount }: { onMount: () => void }) => {
    const {
        payableInvoiceData: { invoiceAccessToken, invoice },
    } = useContext(PayableInvoiceContext);
    const { appConfig } = useContext(InitialContext);
    const { modalState } = useContext(ModalContext);
    const { paymentID } = useActiveModalForm<ApiExtensionFormInfo>(modalState);

    const [gateway, setGateway] = useState<Gateway | null>(null);
    const [destinationStatus, setDestinationStatus] = useState<string | null>(null);

    const { state, complete } = useComplete(appConfig.capiEndpoint, invoiceAccessToken, invoice.id, paymentID);

    useEffect(() => {
        onMount();
    }, []);

    return (
        <>
            <Header title="P2P" />
            <FormContainer>
                <SelectorContainer>
                    <GatewaySelector
                        capiEndpoint={appConfig.capiEndpoint}
                        invoiceAccessToken={invoiceAccessToken}
                        invoiceID={invoice.id}
                        paymentID={paymentID}
                        onSelect={setGateway}
                    ></GatewaySelector>
                    {!isNil(gateway) && (
                        <Destinations
                            capiEndpoint={appConfig.capiEndpoint}
                            gatewayID={gateway?.id}
                            getDestinationsStatusChanged={setDestinationStatus}
                            invoiceAccessToken={invoiceAccessToken}
                            invoiceID={invoice.id}
                            paymentID={paymentID}
                        ></Destinations>
                    )}
                </SelectorContainer>
                {destinationStatus === 'SUCCESS' && (
                    <Button color="primary" onClick={() => complete()}>
                        Complete payment
                    </Button>
                )}
                {state.status === 'FAILURE' && <div>An error ocurred</div>}
            </FormContainer>
        </>
    );
};

export default ApiExtensionForm;
