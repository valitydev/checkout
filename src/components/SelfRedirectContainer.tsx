import { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { InteractionType, Redirect } from 'checkout/backend';

import { LayoutLoader } from './legacy';
import { PaymentContext } from '../common/contexts';
import { prepareForm } from '../common/utils';

const RedirectContainer = styled.div`
    visibility: hidden;
    height: 0;
`;

export function SelfRedirectContainer() {
    const containerRef = useRef(null);
    const [form, setForm] = useState(null);

    const { paymentModel, paymentCondition } = useContext(PaymentContext);

    useEffect(() => {
        if (paymentCondition.name !== 'interactionRequested') {
            throw new Error(
                `Wrong payment condition type. Expected: interactionRequested, actual: ${paymentCondition.name}`,
            );
        }
        const interaction = paymentCondition.interaction;
        if (interaction.interactionType !== InteractionType.Redirect) {
            throw new Error(`Wrong interaction type. Expected: Redirect, actual: ${interaction.interactionType}`);
        }
        const redirect = interaction as Redirect;
        const origin = paymentModel.origin;
        const prepared = prepareForm(origin, redirect.request, '_self');
        containerRef.current.appendChild(prepared);
        setForm(prepared);
    }, []);

    useEffect(() => {
        form && form.submit();
    }, [form]);

    return (
        <>
            <RedirectContainer ref={containerRef} /> <LayoutLoader />
        </>
    );
}
