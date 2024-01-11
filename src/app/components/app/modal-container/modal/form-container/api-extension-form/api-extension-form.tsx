import { useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { Gateway } from 'checkout/backend';
import { ApiExtensionFormInfo } from 'checkout/hooks';
import isNil from 'checkout/utils/is-nil';

import { CompletePayment } from './complete-payment';
import { Destinations } from './destinations';
import { GatewaySelector } from './gateway-selector';
import { InitialContext } from '../../../../initial-context';
import { ModalContext } from '../../../modal-context';
import { PayableInvoiceContext } from '../../../payable-invoice-context';
import { FormLoader } from '../form-loader';
import { useActiveModalForm } from '../use-active-modal-form';

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-height: 380px;
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
    const { appConfig, locale } = useContext(InitialContext);
    const { modalState } = useContext(ModalContext);
    const { paymentID } = useActiveModalForm<ApiExtensionFormInfo>(modalState);

    const [gateway, setGateway] = useState<Gateway | null>(null);
    const [destinationStatus, setDestinationStatus] = useState<string | null>(null);
    const [completeStatus, setCompleteStatus] = useState<string | null>(null);
    const isLoader = useMemo(() => completeStatus === 'SUCCESS' || completeStatus === 'LOADING', [completeStatus]);

    useEffect(() => {
        onMount();
    }, []);

    return (
        <>
            <FormContainer>
                <SelectorContainer>
                    <GatewaySelector
                        capiEndpoint={appConfig.capiEndpoint}
                        invoiceAccessToken={invoiceAccessToken}
                        invoiceID={invoice.id}
                        locale={locale}
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
                            locale={locale}
                            paymentID={paymentID}
                        ></Destinations>
                    )}
                </SelectorContainer>
                {destinationStatus === 'SUCCESS' && (
                    <CompletePayment
                        capiEndpoint={appConfig.capiEndpoint}
                        invoiceAccessToken={invoiceAccessToken}
                        invoiceID={invoice.id}
                        locale={locale}
                        paymentID={paymentID}
                        onCompleteStatusChanged={setCompleteStatus}
                    />
                )}
            </FormContainer>
            {isLoader && <FormLoader />}
        </>
    );
};

export default ApiExtensionForm;
