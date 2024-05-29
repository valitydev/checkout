import { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { BrowserRequest } from 'checkout/backend/payments';
import { GlobalSpinner } from 'checkout/components';
import { LocaleContext } from 'checkout/contexts';

import { prepareForm } from './utils';

const RedirectContainer = styled.div`
    visibility: hidden;
    height: 0;
`;

export type SelfRedirectContainerProps = {
    origin: string;
    request: BrowserRequest;
};

export function SelfRedirectContainer({ origin, request }: SelfRedirectContainerProps) {
    const { l } = useContext(LocaleContext);
    const containerRef = useRef(null);
    const [form, setForm] = useState(null);

    useEffect(() => {
        const prepared = prepareForm(origin, request, '_self');
        containerRef.current.appendChild(prepared);
        setForm(prepared);
    }, [origin, request]);

    useEffect(() => {
        form && form.submit();
    }, [form]);

    return (
        <>
            <GlobalSpinner l={l} />
            <RedirectContainer ref={containerRef} />
        </>
    );
}
