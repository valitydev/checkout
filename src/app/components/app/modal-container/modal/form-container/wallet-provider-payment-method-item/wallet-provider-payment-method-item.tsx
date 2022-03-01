import * as React from 'react';
import { ReactSVG } from 'react-svg';
import { FormInfo, FormName, KnownDigitalWalletProviders, WalletFormInfo } from 'checkout/state';
import { PaymentMethodItemContainer } from './payment-method-item-container';
import { assertUnreachable } from 'checkout/utils';

export interface SticpayPaymentMethodItemProps {
    previous?: FormName;
    setFormInfo: (formInfo: FormInfo) => any;
    provider: KnownDigitalWalletProviders;
}

const toWalletProvider = (props: SticpayPaymentMethodItemProps) =>
    props.setFormInfo(new WalletFormInfo(props.provider, props.previous));

const Icon: React.FC<{ provider: KnownDigitalWalletProviders }> = ({ provider }) => {
    switch (provider) {
        case KnownDigitalWalletProviders.Sticpay:
            return <ReactSVG src="/assets/wallet-providers/logos/sticpay.svg" />;
        default:
            assertUnreachable(provider);
    }
};

export const WalletProviderPaymentMethodItem: React.FC<SticpayPaymentMethodItemProps> = (props) => (
    <PaymentMethodItemContainer id="wallet-provider-payment-method-item" onClick={toWalletProvider.bind(null, props)}>
        <Icon provider={props.provider} />
    </PaymentMethodItemContainer>
);
