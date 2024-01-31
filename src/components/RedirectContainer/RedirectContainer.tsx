import { useContext, useMemo } from 'react';

import { SelfRedirectContainer } from './SelfRedirectContainer';
import { PaymentContext, PaymentModelContext } from '../../common/contexts';
import { findMetadata, isNil } from '../../common/utils';

export function RedirectContainer() {
    const { paymentCondition } = useContext(PaymentContext);
    const {
        paymentModel: { origin, serviceProviders },
    } = useContext(PaymentModelContext);

    if (paymentCondition.name !== 'interactionRequested') {
        throw new Error('Invalid payment condition');
    }
    if (paymentCondition.interaction.type !== 'PaymentInteractionRedirect') {
        throw new Error('Invalid payment interaction');
    }

    const {
        provider,
        interaction: { request },
    } = paymentCondition;

    const redirectType = useMemo(
        (defaultType = 'self') => {
            const { userInteraction } = findMetadata(serviceProviders, provider);
            return isNil(userInteraction) ? defaultType : userInteraction.type;
        },
        [provider, serviceProviders],
    );

    return (
        <>
            {redirectType === 'self' && <SelfRedirectContainer origin={origin} request={request} />}
            {redirectType === 'frame' && <>FrameRedirectContainer</>}
        </>
    );
}
