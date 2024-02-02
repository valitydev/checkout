import { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { BrowserRequest } from 'checkout/backend';

import { prepareForm } from './utils';
import { PaymentContext } from '../../common/contexts';
import { device, isNil } from '../../common/utils';

const Container = styled.div`
    height: 100%; // for cross-browser 100vh
    height: 100vh;
    width: 100%;
    background: #fff;

    @media ${device.desktop} {
        height: 640px;
        width: 768px;
        position: relative;
        border-radius: 16px;
        overflow: hidden;
        padding: 16px;
    }
`;

const IFrame = styled.iframe`
    display: block;
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: scroll;
    border: none;

    @media ${device.desktop} {
        border-radius: 16px;
        position: absolute;
    }
`;

export type FrameRedirectContainerProps = {
    origin: string;
    request: BrowserRequest;
};

export function FrameRedirectContainer({ origin, request }: FrameRedirectContainerProps) {
    const containerRef = useRef(null);
    const [form, setForm] = useState(null);

    const { startWaitingPaymentResult } = useContext(PaymentContext);

    useEffect(() => {
        const form = prepareForm(origin, request);
        containerRef.current.contentWindow.document.body.appendChild(form);
        setForm(form);
    }, []);

    useEffect(() => {
        if (isNil(form)) return;
        form.submit();
        startWaitingPaymentResult();
    }, [form]);

    return (
        <Container>
            <IFrame ref={containerRef} />
        </Container>
    );
}
