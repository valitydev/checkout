import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import styled from 'checkout/styled-components';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { getActiveModalFormSelector } from 'checkout/selectors';
import { RedirectFormInfo, ResultState } from 'checkout/state';
import { Button } from 'checkout/components';
import { prepareForm } from 'checkout/utils';
import { finishInteraction, setResult } from 'checkout/actions';

const RedirectFormContainer = styled.div`
    visibility: hidden;
    height: 0;
`;

const DescriptionContainer = styled.div`
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const CancelLink = styled.div`
    text-decoration: underline;
    cursor: pointer;
`;

const Container = styled.div`
    font-weight: 500;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

export const RedirectForm: React.FC = () => {
    const locale = useAppSelector((s) => s.config.locale);
    const containerRef = useRef(null);
    const [form, setForm] = useState(null);
    const origin = useAppSelector((s) => s.config.origin);
    const { request } = useAppSelector<RedirectFormInfo>(getActiveModalFormSelector);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const prepared = prepareForm(origin, request, '_blank');
        containerRef.current.appendChild(prepared);
        setForm(prepared);
    }, []);

    const redirect = () => {
        form.submit();
        dispatch(finishInteraction());
    };

    const cancel = () => {
        dispatch(setResult(ResultState.close));
    };

    return (
        <Container>
            <RedirectFormContainer ref={containerRef} />
            <DescriptionContainer>{locale['form.pay.redirect.description']}</DescriptionContainer>
            <Button type="submit" color="primary" onClick={redirect}>
                {locale['form.pay.redirect.description.btn.continue']}
            </Button>
            <CancelLink onClick={cancel}>{locale['form.pay.redirect.description.btn.cancel']}</CancelLink>
        </Container>
    );
};
