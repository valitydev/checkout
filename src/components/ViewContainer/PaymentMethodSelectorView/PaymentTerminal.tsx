import { useContext, useMemo } from 'react';

import { PaymentModelContext, ViewModelContext } from '../../../common/contexts';
import { findMetadata, isNil } from '../../../common/utils';
import { MetadataLogo, PaymentMethodItemContainer } from '../../legacy';

export type PaymentTerminalProps = {
    provider: string;
};

export function PaymentTerminal({ provider }: PaymentTerminalProps) {
    const {
        paymentModel: { serviceProviders },
    } = useContext(PaymentModelContext);
    const {
        goTo,
        viewModel: { views },
    } = useContext(ViewModelContext);

    const { logo } = findMetadata(serviceProviders, provider);

    const viewId = useMemo(() => {
        for (const view of views.values()) {
            if (
                view.name === 'PaymentFormView' &&
                view.methodName === 'PaymentTerminal' &&
                view.provider === provider
            ) {
                return view.id;
            }
        }
    }, [views]);

    return (
        <PaymentMethodItemContainer
            id={`${Math.floor(Math.random() * 100)}-payment-method-item`}
            onClick={() => goTo(viewId)}
        >
            {!isNil(logo) && <MetadataLogo metadata={logo} />}
            {isNil(logo) && <>{provider}</>}
        </PaymentMethodItemContainer>
    );
}
