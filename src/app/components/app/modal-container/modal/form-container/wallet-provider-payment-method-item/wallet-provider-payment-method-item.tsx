import * as React from 'react';
import { useEffect } from 'react';

import {
    FormInfo,
    FormName,
    PaymentTerminalFormValues,
    ResultFormInfo,
    ResultType,
    WalletFormInfo
} from 'checkout/state';
import { getMetadata, MetadataLogo, PaymentMethodItemContainer } from 'checkout/components/ui';
import { PaymentMethodName, ServiceProvider } from 'checkout/backend';
import { goToFormInfo, prepareToPay } from 'checkout/actions';
import { useAppDispatch } from 'checkout/configure-store';
import isNil from 'checkout/utils/is-nil';
import { useCreatePayment } from 'checkout/hooks';

export type SetFormInfoAction = (formInfo: FormInfo) => any;

export interface WalletProviderPaymentMethodItemProps {
    serviceProvider: ServiceProvider;
}

export const WalletProviderPaymentMethodItem = ({ serviceProvider }: WalletProviderPaymentMethodItemProps) => {
    const { logo, form } = getMetadata(serviceProvider);

    const { createPaymentState, setFormData } = useCreatePayment();
    const dispatch = useAppDispatch();

    const onClick = () => {
        if (isNil(form)) {
            dispatch(prepareToPay());
            setFormData({
                method: PaymentMethodName.PaymentTerminal,
                values: {
                    provider: serviceProvider.id
                } as PaymentTerminalFormValues
            });
        } else {
            dispatch(goToFormInfo(new WalletFormInfo(serviceProvider, FormName.paymentMethods)));
        }
    };

    useEffect(() => {
        if (createPaymentState.status === 'FAILURE') {
            const error = createPaymentState.error;
            dispatch(goToFormInfo(new ResultFormInfo(ResultType.hookError, { error })));
        }
    }, [createPaymentState]);

    return (
        <PaymentMethodItemContainer onClick={onClick}>
            {logo && <MetadataLogo metadata={logo} />}
        </PaymentMethodItemContainer>
    );
};
