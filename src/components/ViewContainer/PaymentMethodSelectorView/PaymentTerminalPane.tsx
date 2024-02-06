import { useContext } from 'react';

import { PaymentModelContext, ViewModelContext } from '../../../common/contexts';
import { findMetadata, isNil } from '../../../common/utils';
import { MetadataLogo, PaymentMethodItemContainer } from '../../legacy';

export type PaymentTerminalPaneProps = {
    destinationViewId: string;
};

export function PaymentTerminalPane({ destinationViewId }: PaymentTerminalPaneProps) {
    const {
        paymentModel: { serviceProviders },
    } = useContext(PaymentModelContext);
    const {
        goTo,
        viewModel: { views },
    } = useContext(ViewModelContext);
    const destination = views.get(destinationViewId);

    if (destination.name !== 'PaymentFormView') {
        throw new Error(`Wrong View. Expected: PaymentFormView, actual: ${destination.name}`);
    }

    const { logo } = findMetadata(serviceProviders, destination.provider);

    return (
        <PaymentMethodItemContainer
            id={`${Math.floor(Math.random() * 100)}-payment-method-item`}
            onClick={() => goTo(destinationViewId)}
        >
            {!isNil(logo) && <MetadataLogo metadata={logo} />}
            {isNil(logo) && <>{destination.provider}</>}
        </PaymentMethodItemContainer>
    );
}
