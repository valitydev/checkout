import { useContext, useState } from 'react';

import { Destination } from 'checkout/backend/p2p';
import { PaymentConditionsContext, PaymentModelContext } from 'checkout/contexts';
import { InvoiceDetermined, PaymentStarted } from 'checkout/paymentCondition';
import { isNil } from 'checkout/utils';

import { ApiExtensionViewContext } from './ApiExtensionViewContext';
import { Destinations } from './Destinations';
import { GatewaySelectorTmp } from './GatewaySelector';

export function ApiExtensionView() {
    const {
        paymentModel: { apiEndpoint },
    } = useContext(PaymentModelContext);
    const { conditions } = useContext(PaymentConditionsContext);

    const { paymentId } = conditions.find((c) => c.name === 'paymentStarted') as PaymentStarted;
    const {
        invoiceContext: {
            invoiceParams: { invoiceID, invoiceAccessToken },
        },
    } = conditions.find((c) => c.name === 'invoiceDetermined') as InvoiceDetermined;

    const [destinations, setDestinations] = useState<Destination[] | null>(null);

    return (
        <ApiExtensionViewContext.Provider value={{ apiEndpoint, invoiceAccessToken, invoiceID, paymentId }}>
            {isNil(destinations) && <GatewaySelectorTmp onFetchDestinations={setDestinations} />}
            {!isNil(destinations) && <Destinations destinations={destinations} />}
        </ApiExtensionViewContext.Provider>
    );
}
