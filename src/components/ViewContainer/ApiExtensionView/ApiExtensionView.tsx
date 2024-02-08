import { useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { Gateway } from 'checkout/backend';

import { CompletePayment } from './CompletePayment';
import { Destinations } from './Destinations';
import { GatewaySelector } from './GatewaySelector';
import { LocaleContext, PaymentConditionsContext, PaymentContext, PaymentModelContext } from '../../../common/contexts';
import { InvoiceDetermined, PaymentStarted } from '../../../common/paymentCondition';
import { isNil } from '../../../common/utils';
import { FormLoader } from '../../../components/legacy';

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-height: 500px;
    justify-content: space-between;
`;

const SelectorContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

export function ApiExtensionView() {
    const { l } = useContext(LocaleContext);
    const {
        paymentModel: { apiEndpoint },
    } = useContext(PaymentModelContext);
    const { conditions } = useContext(PaymentConditionsContext);
    const { startWaitingPaymentResult } = useContext(PaymentContext);

    const { paymentId } = conditions.find((c) => c.name === 'paymentStarted') as PaymentStarted;
    const {
        invoiceContext: {
            invoiceParams: { invoiceID, invoiceAccessToken },
        },
    } = conditions.find((c) => c.name === 'invoiceDetermined') as InvoiceDetermined;

    const [gateway, setGateway] = useState<Gateway | null>(null);
    const [destinationStatus, setDestinationStatus] = useState<string | null>(null);
    const [completeStatus, setCompleteStatus] = useState<string | null>(null);
    const isLoader = useMemo(() => completeStatus === 'SUCCESS' || completeStatus === 'LOADING', [completeStatus]);

    useEffect(() => {
        startWaitingPaymentResult();
    }, []);

    return (
        <>
            <FormContainer>
                <SelectorContainer>
                    <GatewaySelector
                        capiEndpoint={apiEndpoint}
                        invoiceAccessToken={invoiceAccessToken}
                        invoiceID={invoiceID}
                        locale={l}
                        paymentID={paymentId}
                        onSelect={setGateway}
                    ></GatewaySelector>
                    {!isNil(gateway) && (
                        <Destinations
                            capiEndpoint={apiEndpoint}
                            gatewayID={gateway?.id}
                            getDestinationsStatusChanged={setDestinationStatus}
                            invoiceAccessToken={invoiceAccessToken}
                            invoiceID={invoiceID}
                            locale={l}
                            paymentID={paymentId}
                        ></Destinations>
                    )}
                </SelectorContainer>
                {!isNil(gateway) && destinationStatus === 'SUCCESS' && (
                    <CompletePayment
                        capiEndpoint={apiEndpoint}
                        invoiceAccessToken={invoiceAccessToken}
                        invoiceID={invoiceID}
                        locale={l}
                        paymentID={paymentId}
                        onCompleteStatusChanged={setCompleteStatus}
                    />
                )}
            </FormContainer>
            {isLoader && <FormLoader />}
        </>
    );
}
