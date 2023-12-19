import { useContext, useEffect } from 'react';

import { ApiExtensionFormInfo } from 'checkout/hooks';

import { GatewaySelector } from './gateway-selector';
import { InitialContext } from '../../../../initial-context';
import { ModalContext } from '../../../modal-context';
import { PayableInvoiceContext } from '../../../payable-invoice-context';
import { useActiveModalForm } from '../use-active-modal-form';

const ApiExtensionForm = ({ onMount }: { onMount: () => void }) => {
    const {
        payableInvoiceData: { invoiceAccessToken, invoice },
    } = useContext(PayableInvoiceContext);
    const { appConfig } = useContext(InitialContext);
    const { modalState } = useContext(ModalContext);
    const { paymentID } = useActiveModalForm<ApiExtensionFormInfo>(modalState);

    useEffect(() => {
        onMount();
    }, []);

    return (
        <>
            <GatewaySelector
                capiEndpoint={appConfig.capiEndpoint}
                invoiceAccessToken={invoiceAccessToken}
                invoiceID={invoice.id}
                paymentID={paymentID}
            ></GatewaySelector>
        </>
    );
};

export default ApiExtensionForm;
