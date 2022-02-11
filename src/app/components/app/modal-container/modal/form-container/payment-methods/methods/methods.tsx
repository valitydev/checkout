import * as React from 'react';
import { DigitalWalletPaymentMethod, FormName, PaymentMethod, PaymentMethodName } from 'checkout/state';
import { assertUnreachable } from 'checkout/utils';
import { Euroset } from './euroset';
import { Wallets } from './wallets';
import { ApplePay } from './apple-pay';
import { BankCard } from './bank-card';
import { GooglePay } from './google-pay';
import { MethodProps } from './method-props';
import { SamsungPay } from './samsung-pay';
import { QPS } from './qps';
import { MobileCommerce } from './mobile-commerce';
import { Uzcard } from './uzcard';
import { YandexPay } from './yandex-pay';
import { WalletProviderPaymentMethodItem } from '../../wallet-provider-payment-method-item';

const Method: React.FC<MethodProps> = (props) => {
    switch (props.method.name) {
        case PaymentMethodName.Euroset:
            return <Euroset {...props} />;
        case PaymentMethodName.Uzcard:
            return <Uzcard {...props} />;
        case PaymentMethodName.QPS:
            return <QPS {...props} />;
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
            <Method key={method.name} method={method} {...props} />
        ))}
    </>
);
