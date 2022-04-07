import * as React from 'react';
import { FormInfo, FormName, KnownDigitalWalletProviders, WalletFormInfo } from 'checkout/state';
import { assertUnreachable } from 'checkout/utils';
import { VenuspointLogo, SticpayLogo, PaymentMethodItemContainer } from 'checkout/components/ui';
import { ServiceProvider } from 'checkout/backend';

export interface WalletProviderPaymentMethodItemProps {
    previous?: FormName;
    setFormInfo: (formInfo: FormInfo) => void;
    serviceProvider: ServiceProvider;
}

const toWalletProvider = (props: WalletProviderPaymentMethodItemProps) =>
    props.setFormInfo(new WalletFormInfo(props.serviceProvider, props.previous));

const Icon: React.FC<{ serviceProvider: ServiceProvider }> = ({ serviceProvider }) => {
    switch (serviceProvider.id) {
        case KnownDigitalWalletProviders.Sticpay:
            return <SticpayLogo />;
        case KnownDigitalWalletProviders.Venuspoint:
            return <VenuspointLogo />;
        default:
            assertUnreachable(provider);
    }
};

export const WalletProviderPaymentMethodItem: React.FC<WalletProviderPaymentMethodItemProps> = (props) => (
    <PaymentMethodItemContainer id="wallet-provider-payment-method-item" onClick={toWalletProvider.bind(null, props)}>
        <Icon serviceProvider={props.serviceProvider} />
    </PaymentMethodItemContainer>
);
