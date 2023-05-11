import * as React from 'react';

import { FormInfo, FormName, PaymentTerminalFormValues, WalletFormInfo } from 'checkout/state';
import { getMetadata, MetadataLogo, PaymentMethodItemContainer } from 'checkout/components/ui';
import { PaymentMethodName, ServiceProvider } from 'checkout/backend';
import { AppContext, PaymentRequestedPayload } from 'checkout/actions';

export type SetFormInfoAction = (formInfo: FormInfo) => any;
export type PayAction = (payload: PaymentRequestedPayload) => any;

export interface WalletProviderPaymentMethodItemProps {
    previous?: FormName;
    serviceProvider: ServiceProvider;
    setFormInfo: SetFormInfoAction;
    pay: PayAction;
    context: AppContext;
}

const provideTerminalPayment = (context: AppContext, pay: PayAction, provider: string) =>
    pay({
        method: PaymentMethodName.PaymentTerminal,
        values: {
            provider
        } as PaymentTerminalFormValues,
        context
    });

const provideMethod = ({
    serviceProvider,
    setFormInfo,
    pay,
    previous,
    context
}: WalletProviderPaymentMethodItemProps) => {
    const { form } = getMetadata(serviceProvider);
    form
        ? setFormInfo(new WalletFormInfo(serviceProvider, previous))
        : provideTerminalPayment(context, pay, serviceProvider.id);
};

export const WalletProviderPaymentMethodItem = (props: WalletProviderPaymentMethodItemProps) => {
    const { logo } = getMetadata(props.serviceProvider);
    return (
        <PaymentMethodItemContainer onClick={() => provideMethod(props)}>
            {logo && <MetadataLogo metadata={logo} />}
        </PaymentMethodItemContainer>
    );
};
