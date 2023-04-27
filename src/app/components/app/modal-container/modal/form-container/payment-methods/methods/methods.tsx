import * as React from 'react';
import {
    DigitalWalletPaymentMethod,
    FormName,
    PaymentMethod,
    PaymentMethodName,
    PaymentTerminalPaymentMethod
} from 'checkout/state';
import { assertUnreachable } from 'checkout/utils';
import { Wallets } from './wallets';
import { BankCard } from './bank-card';
import { MethodProps } from './method-props';
import { WalletProviderPaymentMethodItem } from '../../wallet-provider-payment-method-item';
import { PaymentTerminalMethodItems } from './payment-terminal-method-items';

const Method: React.FC<MethodProps> = (props) => {
    switch (props.method.name) {
        case PaymentMethodName.BankCard:
            return <BankCard {...props} />;
        case PaymentMethodName.PaymentTerminal:
            return (
                <PaymentTerminalMethodItems
                    method={props.method as PaymentTerminalPaymentMethod}
                    locale={props.locale}
                    setFormInfo={props.setFormInfo}
                    pay={props.pay}
                    localeCode={props.localeCode}
                    emailPrefilled={props.emailPrefilled}
                    phoneNumberPrefilled={props.phoneNumberPrefilled}
                    context={props.context}
                />
            );
        case PaymentMethodName.DigitalWallet:
            const { serviceProviders } = props.method as DigitalWalletPaymentMethod;
            if (serviceProviders.length === 1) {
                return (
                    <WalletProviderPaymentMethodItem
                        serviceProvider={serviceProviders[0]}
                        previous={FormName.paymentMethods}
                        setFormInfo={props.setFormInfo}
                        pay={props.pay}
                        context={props.context}
                    />
                );
            }
            return <Wallets {...props} />;
        default:
            assertUnreachable(props.method.name);
            return null;
    }
};

export const Methods: React.FC<{ methods: PaymentMethod[]; props: Omit<MethodProps, 'method'> }> = ({
    methods,
    props
}) => (
    <>
        {methods.map((method, index) => (
            <Method key={index} method={method} {...props} />
        ))}
    </>
);
