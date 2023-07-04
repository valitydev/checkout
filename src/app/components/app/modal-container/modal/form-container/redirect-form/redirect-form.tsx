import * as React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';

import styled from 'checkout/styled-components';
import { RedirectFormInfo } from 'checkout/hooks';
import { prepareForm } from 'checkout/utils';

import { InitialContext } from '../../../../initial-context';
import { ModalContext } from '../../../modal-context';
import { useActiveModalForm } from '../use-active-modal-form';

const RedirectFormContainer = styled.div`
    visibility: hidden;
    height: 0;
`;

const Container = styled.div`
    height: 360px;
`;

export const RedirectForm = ({ onMount }: { onMount: () => void }) => {
    const containerRef = useRef(null);
    const [form, setForm] = useState(null);
    const { origin } = useContext(InitialContext);
    const { modalState } = useContext(ModalContext);
    const { request } = useActiveModalForm<RedirectFormInfo>(modalState);

    useEffect(() => {
        onMount();
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
