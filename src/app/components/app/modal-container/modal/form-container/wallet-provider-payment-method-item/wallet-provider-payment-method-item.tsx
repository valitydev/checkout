import * as React from 'react';

import { FormInfo, FormName, WalletFormInfo } from 'checkout/state';
import { getMetadata, MetadataLogo, PaymentMethodItemContainer } from 'checkout/components/ui';
import { ServiceProvider } from 'checkout/backend';

export interface WalletProviderPaymentMethodItemProps {
    previous?: FormName;
    setFormInfo: (formInfo: FormInfo) => void;
    serviceProvider: ServiceProvider;
}

const toWalletProvider = (props: WalletProviderPaymentMethodItemProps) =>
    props.setFormInfo(new WalletFormInfo(props.serviceProvider, props.previous));

export const WalletProviderPaymentMethodItem: React.FC<WalletProviderPaymentMethodItemProps> = (props) => {
    const { logo } = getMetadata(props.serviceProvider);
    return (
        <PaymentMethodItemContainer onClick={() => toWalletProvider(props)}>
            {logo && <MetadataLogo metadata={logo} />}
        </PaymentMethodItemContainer>
    );
};
