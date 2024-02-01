import { useContext, useMemo } from 'react';

import { SelfRedirectContainer } from './SelfRedirectContainer';
import { PaymentConditionsContext, PaymentModelContext } from '../../common/contexts';
import { PaymentStarted } from '../../common/paymentCondition';
import { findMetadata, isNil, last } from '../../common/utils';

export function RedirectContainer() {
    const { conditions } = useContext(PaymentConditionsContext);
    const lastCondition = last(conditions);
    const {
        paymentModel: { origin, serviceProviders },
    } = useContext(PaymentModelContext);

    if (lastCondition.name !== 'interactionRequested') {
        throw new Error('Invalid payment condition');
    }
    if (lastCondition.interaction.type !== 'PaymentInteractionRedirect') {
        throw new Error('Invalid payment interaction');
    }

    const paymentStarted = conditions.find((condition) => {
        if (condition.name === 'paymentStarted') {
            return condition.paymentId === lastCondition.paymentId;
        }
    }) as PaymentStarted;

    if (isNil(paymentStarted.provider)) {
        throw new Error('Payment started condition should contain provider');
    }

    const provider = paymentStarted.provider;

    const redirectType = useMemo(
        (defaultType = 'self') => {
            const { userInteraction } = findMetadata(serviceProviders, provider);
            return isNil(userInteraction) ? defaultType : userInteraction.type;
        },
        [provider, serviceProviders],
    );

    const {
        interaction: { request },
    } = lastCondition;

    return (
        <>
            {redirectType === 'self' && <SelfRedirectContainer origin={origin} request={request} />}
            {redirectType === 'frame' && <>FrameRedirectContainer</>}
        </>
    );
}
