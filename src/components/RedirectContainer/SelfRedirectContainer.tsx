import { Box } from '@chakra-ui/react';
import { useContext, useEffect, useRef, useState } from 'react';

import { BrowserRequest } from 'checkout/backend/payments';
import { GlobalSpinner } from 'checkout/components';
import { LocaleContext } from 'checkout/contexts';

import { prepareForm } from './utils';

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
            <Box ref={containerRef} height={0} visibility="hidden" />
        </>
    );
}
