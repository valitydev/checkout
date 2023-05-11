import * as React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';

import styled from 'checkout/styled-components';
import { useAppSelector } from 'checkout/configure-store';
import { getActiveModalFormSelector } from 'checkout/selectors';
import { RedirectFormInfo } from 'checkout/state';
import { prepareForm } from 'checkout/utils';

import { InitialContext } from '../../../../initial-context';

const RedirectFormContainer = styled.div`
    visibility: hidden;
    height: 0;
`;

const Container = styled.div`
    height: 360px;
`;

export const RedirectForm: React.FC = () => {
    const containerRef = useRef(null);
    const [form, setForm] = useState(null);
    const { origin } = useContext(InitialContext);
    const { request } = useAppSelector<RedirectFormInfo>(getActiveModalFormSelector);

    useEffect(() => {
        const prepared = prepareForm(origin, request, '_self');
        containerRef.current.appendChild(prepared);
        setForm(prepared);
    }, []);

    useEffect(() => {
        form && form.submit();
    }, [form]);

    return (
        <Container>
            <RedirectFormContainer ref={containerRef} />
        </Container>
    );
};
