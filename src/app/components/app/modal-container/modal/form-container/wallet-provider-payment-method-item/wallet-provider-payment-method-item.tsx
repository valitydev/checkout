import * as React from 'react';
import { FormInfo, FormName, KnownDigitalWalletProviders, WalletFormInfo } from 'checkout/state';
import { assertUnreachable } from 'checkout/utils';
import { VenuspointLogo, SticpayLogo, PaymentMethodItemContainer } from 'checkout/components/ui';

export interface WalletProviderPaymentMethodItemProps {
    previous?: FormName;
    setFormInfo: (formInfo: FormInfo) => any;
    provider: KnownDigitalWalletProviders;
}

const toWalletProvider = (props: WalletProviderPaymentMethodItemProps) =>
    props.setFormInfo(new WalletFormInfo(props.provider, props.previous));

const Icon: React.FC<{ provider: KnownDigitalWalletProviders }> = ({ provider }) => {
    switch (provider) {
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
        <Icon provider={props.provider} />
    </PaymentMethodItemContainer>
);
