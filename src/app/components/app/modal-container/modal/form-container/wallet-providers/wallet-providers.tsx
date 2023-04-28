import * as React from 'react';
import { useContext } from 'react';

import { FormName } from 'checkout/state';
import { Header } from '../header';
import { goToFormInfo, pay } from 'checkout/actions';
import { WalletProviderPaymentMethodItem } from '../wallet-provider-payment-method-item';
import { useAppDispatch } from 'checkout/configure-store';
import { InitialContext } from '../../../../initial-context';
import { DigitalWalletPaymentMethod, PaymentMethodName } from 'checkout/hooks/init-available-payment-methods';

const getAvailablePaymentMethod = (
    availablePaymentMethods,
    methodName: PaymentMethodName
): DigitalWalletPaymentMethod => availablePaymentMethods.find((m) => m.name === methodName);

export const WalletProviders: React.FC = () => {
    const context = useContext(InitialContext);
    const { locale, availablePaymentMethods } = context;
    const paymentMethod = getAvailablePaymentMethod(availablePaymentMethods, PaymentMethodName.DigitalWallet);
    const dispatch = useAppDispatch();

    return (
        <div>
            <Header title={locale['form.header.payment.methods.label']} />
            {paymentMethod.serviceProviders.map((serviceProvider) => (
                <WalletProviderPaymentMethodItem
                    key={serviceProvider.id}
                    previous={FormName.walletProviders}
                    setFormInfo={(formInfo) => dispatch(goToFormInfo(formInfo))}
                    serviceProvider={serviceProvider}
                    pay={(payload) => dispatch(pay(payload))}
                    context={context}
                />
            ))}
        </div>
    );
};
