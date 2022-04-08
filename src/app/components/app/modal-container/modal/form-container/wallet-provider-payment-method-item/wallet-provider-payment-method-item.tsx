import * as React from 'react';

import { FormInfo, FormName, WalletFormInfo } from 'checkout/state';
import { getLogoMetadata, MetadataLogo, PaymentMethodItemContainer } from 'checkout/components/ui';
import { ServiceProvider } from 'checkout/backend';

export interface WalletProviderPaymentMethodItemProps {
    previous?: FormName;
    setFormInfo: (formInfo: FormInfo) => void;
    serviceProvider: ServiceProvider;
}

const toWalletProvider = (props: WalletProviderPaymentMethodItemProps) =>
    props.setFormInfo(new WalletFormInfo(props.serviceProvider, props.previous));

export const WalletProviderPaymentMethodItem: React.FC<WalletProviderPaymentMethodItemProps> = (props) => {
    const logoMetadata = getLogoMetadata(props.serviceProvider);
    return (
        <PaymentMethodItemContainer onClick={() => toWalletProvider(props)}>
            {logoMetadata && <MetadataLogo metadata={logoMetadata} />}
        </PaymentMethodItemContainer>
    );
};
