import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { prepareForm } from './utils';
import { BrowserRequest } from '../../common/backend/payments';
import { LayoutLoader } from '../legacy';

const RedirectContainer = styled.div`
    visibility: hidden;
    height: 0;
`;

export type SelfRedirectContainerProps = {
    origin: string;
    request: BrowserRequest;
};

export function SelfRedirectContainer({ origin, request }: SelfRedirectContainerProps) {
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
            <LayoutLoader />
            <RedirectContainer ref={containerRef} />
        </>
    );
}
