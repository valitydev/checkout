import * as React from 'react';
import { useEffect } from 'react';

import { FormInfo, FormName, PaymentTerminalFormValues, WalletFormInfo } from 'checkout/state';
import { getMetadata, MetadataLogo, PaymentMethodItemContainer } from 'checkout/components/ui';
import { PaymentMethodName, ServiceProvider } from 'checkout/backend';
import { PaymentRequestedPayload, goToFormInfo, pay } from 'checkout/actions';
import { useAppDispatch } from 'checkout/configure-store';
import isNil from 'checkout/utils/is-nil';
import { usePreparePayableData } from '../use-prepare-payable-data';

export type SetFormInfoAction = (formInfo: FormInfo) => any;
export type PayAction = (payload: PaymentRequestedPayload) => any;

export interface WalletProviderPaymentMethodItemProps {
    serviceProvider: ServiceProvider;
}

export const WalletProviderPaymentMethodItem = ({ serviceProvider }: WalletProviderPaymentMethodItemProps) => {
    const { logo, form } = getMetadata(serviceProvider);

    const [preparedPayload, setSubmitData] = usePreparePayableData();
    const dispatch = useAppDispatch();

    const onClick = () => {
        if (isNil(form)) {
            setSubmitData({
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
        if (!isNil(preparedPayload)) {
            dispatch(pay(preparedPayload));
        }
    }, [preparedPayload]);

    return (
        <PaymentMethodItemContainer onClick={onClick}>
            {logo && <MetadataLogo metadata={logo} />}
        </PaymentMethodItemContainer>
    );
};
