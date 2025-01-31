import { useContext, useEffect } from 'react';

import { PaymentConditionsContext, PaymentModelContext } from 'checkout/contexts';
import { InvoiceDetermined, PaymentStarted } from 'checkout/paymentCondition';

import { ApiExtensionViewContext } from './ApiExtensionViewContext';
import { Destinations } from './Destinations';
import { FetchRequisitesError } from './FetchRequisitesError';
import { GatewaySelector } from './GatewaySelector';
import { RequisitesLoader } from './RequisitesLoader';
import { useRequisites } from './useRequisites';

export function ApiExtensionView() {
    const {
        paymentModel: { apiEndpoint },
    } = useContext(PaymentModelContext);
    const { conditions } = useContext(PaymentConditionsContext);

    const { paymentId } = conditions.find<PaymentStarted>((c) => c.name === 'paymentStarted');
    const {
        invoiceContext: {
            invoiceParams: { invoiceID, invoiceAccessToken },
        },
    } = conditions.find<InvoiceDetermined>((c) => c.name === 'invoiceDetermined');

    const { state, start, setGateway } = useRequisites(apiEndpoint, invoiceAccessToken, invoiceID, paymentId);

    useEffect(() => {
        start();
    }, []);

    return (
        <ApiExtensionViewContext.Provider value={{ apiEndpoint, invoiceAccessToken, invoiceID, paymentId }}>
            {state.status === 'REQUIRE_GATEWAY_SELECTION' && (
                <GatewaySelector gateways={state.gateway} onSelect={setGateway} />
            )}
            {state.status === 'READY' && <Destinations destinations={state.destinations} />}
            {state.status === 'LOADING' && <RequisitesLoader />}
            {state.status === 'FAILURE' && <FetchRequisitesError />}
        </ApiExtensionViewContext.Provider>
    );
}
