import { Text } from '@chakra-ui/react';
import { useContext } from 'react';

import { PaymentModelContext, ViewModelContext } from '../../../common/contexts';
import { isNil } from '../../../common/utils';
import { findMetadata } from '../../../common/utils/findMetadata';
import { MetadataLogo, PaymentMethodItemContainer } from '../../legacy';

export type PaymentTerminalPaneProps = {
    destinationViewId: string;
};

export function PaymentTerminalPane({ destinationViewId }: PaymentTerminalPaneProps) {
    const {
        paymentModel: { serviceProviders },
    } = useContext(PaymentModelContext);
    const {
        forward,
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
            onClick={() => forward(destinationViewId)}
        >
            {!isNil(logo) && <MetadataLogo metadata={logo} />}
            {isNil(logo) && <Text>{destination.provider}</Text>}
        </PaymentMethodItemContainer>
    );
}
