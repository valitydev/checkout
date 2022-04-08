import * as React from 'react';
import { FormName, PaymentMethodName, DigitalWalletPaymentMethod } from 'checkout/state';
import { Header } from '../header';
import { goToFormInfo } from 'checkout/actions';
import { WalletProviderPaymentMethodItem } from '../wallet-provider-payment-method-item';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { getAvailablePaymentMethodSelector, getLocaleSelector } from 'checkout/selectors';

export const WalletProviders: React.FC = () => {
    const locale = useAppSelector(getLocaleSelector);
    const paymentMethod = useAppSelector(
        getAvailablePaymentMethodSelector<DigitalWalletPaymentMethod>(PaymentMethodName.DigitalWallet)
    );
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
                />
            ))}
        </div>
    );
};
