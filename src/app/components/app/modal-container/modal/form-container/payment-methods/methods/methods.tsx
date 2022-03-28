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
import { ApplePay } from './apple-pay';
import { BankCard } from './bank-card';
import { GooglePay } from './google-pay';
import { MethodProps } from './method-props';
import { SamsungPay } from './samsung-pay';
import { MobileCommerce } from './mobile-commerce';
import { YandexPay } from './yandex-pay';
import { WalletProviderPaymentMethodItem } from '../../wallet-provider-payment-method-item';
import { PaymentTerminalMethodItems } from './payment-terminal-method-items';

const Method: React.FC<MethodProps> = (props) => {
    switch (props.method.name) {
        case PaymentMethodName.BankCard:
            return <BankCard {...props} />;
        case PaymentMethodName.ApplePay:
            return <ApplePay {...props} />;
        case PaymentMethodName.GooglePay:
            return <GooglePay {...props} />;
        case PaymentMethodName.SamsungPay:
            return <SamsungPay {...props} />;
        case PaymentMethodName.YandexPay:
            return <YandexPay {...props} />;
        case PaymentMethodName.MobileCommerce:
            return <MobileCommerce {...props} />;
        case PaymentMethodName.PaymentTerminal:
            const { category } = props.method as PaymentTerminalPaymentMethod;
            return (
                <PaymentTerminalMethodItems category={category} locale={props.locale} setFormInfo={props.setFormInfo} />
            );
        case PaymentMethodName.DigitalWallet:
            const { providers } = props.method as DigitalWalletPaymentMethod;
            if (providers.length === 1) {
                return (
                    <WalletProviderPaymentMethodItem
                        provider={providers[0]}
                        previous={FormName.paymentMethods}
                        setFormInfo={props.setFormInfo}
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
        {methods.map((method) => (
            <Method key={method.name + method.priority} method={method} {...props} />
        ))}
    </>
);
