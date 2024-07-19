import { useContext } from 'react';
import { HiCash } from 'react-icons/hi';

import { Pane, PaneLogoBox, PaneLogo, PaneText, PaneMetadataLogo } from 'checkout/components';
import { PaymentModelContext } from 'checkout/contexts';
import { isNil } from 'checkout/utils';
import { findMetadata } from 'checkout/utils/findMetadata';

export type PaymentTerminalPaneProps = {
    provider: string;
    onClick: () => void;
};

export function PaymentTerminalPane({ onClick, provider }: PaymentTerminalPaneProps) {
    const {
        paymentModel: { serviceProviders },
    } = useContext(PaymentModelContext);
    const { logo } = findMetadata(serviceProviders, provider);
    const serviceProvider = serviceProviders.find(({ id }) => id === provider);

    return (
        <Pane onClick={onClick}>
            <PaneLogoBox>
                {isNil(logo) && <PaneLogo as={HiCash} />} {!isNil(logo) && <PaneMetadataLogo logo={logo} />}
            </PaneLogoBox>
            <PaneText>{serviceProvider?.brandName}</PaneText>
        </Pane>
    );
}
