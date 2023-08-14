import * as React from 'react';
import { useContext, useEffect } from 'react';

import { Header } from '../header';
import { WalletProviderPaymentMethodItem } from '../wallet-provider-payment-method-item';
import { InitialContext } from '../../../../initial-context';
import { DigitalWalletPaymentMethod, PaymentMethodName } from 'checkout/hooks';

const getAvailablePaymentMethod = (
    availablePaymentMethods,
    methodName: PaymentMethodName,
): DigitalWalletPaymentMethod => availablePaymentMethods.find((m) => m.name === methodName);

export const WalletProviders = ({ onMount }: { onMount: () => void }) => {
    const context = useContext(InitialContext);
    const { locale, availablePaymentMethods } = context;
    const paymentMethod = getAvailablePaymentMethod(availablePaymentMethods, PaymentMethodName.DigitalWallet);

    useEffect(() => {
        onMount();
    }, []);

    return (
        <div>
            <Header title={locale['form.header.payment.methods.label']} />
            {paymentMethod.serviceProviders.map((serviceProvider) => (
                <WalletProviderPaymentMethodItem key={serviceProvider.id} serviceProvider={serviceProvider} />
            ))}
        </div>
    );
};
