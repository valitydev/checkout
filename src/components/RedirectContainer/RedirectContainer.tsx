import { useContext, useMemo } from 'react';

import { PaymentConditionsContext, PaymentModelContext } from 'checkout/contexts';
import { PaymentStarted } from 'checkout/paymentCondition';
import { isNil, last } from 'checkout/utils';
import { findMetadata } from 'checkout/utils/findMetadata';

import { FrameRedirectContainer } from './FrameRedirectContainer';
import { SelfRedirectContainer } from './SelfRedirectContainer';

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

    const redirectType = useMemo(
        (defaultType = 'self') => {
            if (isNil(paymentStarted?.provider)) return defaultType;
            const { userInteraction } = findMetadata(serviceProviders, paymentStarted.provider);
            return isNil(userInteraction) ? defaultType : userInteraction.type;
        },
        [paymentStarted, serviceProviders],
    );

    const {
        interaction: { request },
    } = lastCondition;

    return (
        <>
            {redirectType === 'self' && <SelfRedirectContainer origin={origin} request={request} />}
            {redirectType === 'frame' && <FrameRedirectContainer origin={origin} request={request} />}
        </>
    );
}
