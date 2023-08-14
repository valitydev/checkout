import * as React from 'react';
import { useContext, useEffect } from 'react';

import { FormInfo, FormName, ResultFormInfo, ResultType, WalletFormInfo } from 'checkout/hooks';
import { getMetadata, MetadataLogo, PaymentMethodItemContainer } from 'checkout/components/ui';
import { PaymentMethodName, ServiceProvider } from 'checkout/backend';
import isNil from 'checkout/utils/is-nil';
import { PaymentTerminalFormValues, useCreatePayment } from 'checkout/hooks';
import { ModalContext } from '../../../modal-context';

export type SetFormInfoAction = (formInfo: FormInfo) => any;

export interface WalletProviderPaymentMethodItemProps {
    serviceProvider: ServiceProvider;
}

export const WalletProviderPaymentMethodItem = ({ serviceProvider }: WalletProviderPaymentMethodItemProps) => {
    const { logo, form } = getMetadata(serviceProvider);
    const { prepareToPay, goToFormInfo } = useContext(ModalContext);
    const { createPaymentState, setFormData } = useCreatePayment();

    const onClick = () => {
        if (isNil(form)) {
            prepareToPay();
            setFormData({
                method: PaymentMethodName.PaymentTerminal,
                values: {
                    provider: serviceProvider.id,
                } as PaymentTerminalFormValues,
            });
        } else {
            goToFormInfo(new WalletFormInfo(serviceProvider, FormName.walletProviders));
        }
    };

    useEffect(() => {
        if (createPaymentState.status === 'FAILURE') {
            const error = createPaymentState.error;
            goToFormInfo(new ResultFormInfo(ResultType.hookError, { error }));
        }
    }, [createPaymentState]);

    return (
        <PaymentMethodItemContainer onClick={onClick}>
            {logo && <MetadataLogo metadata={logo} />}
        </PaymentMethodItemContainer>
    );
};
