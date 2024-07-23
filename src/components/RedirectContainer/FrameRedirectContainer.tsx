import { Box } from '@chakra-ui/react';
import { useContext, useEffect, useRef, useState } from 'react';

import { BrowserRequest } from 'checkout/backend/payments';
import { PaymentContext } from 'checkout/contexts';
import { isNil } from 'checkout/utils';

import { prepareForm } from './utils';

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
        <Box
            background="white"
            borderRadius="xl"
            height={['lg', 'lg', '640px']}
            overflow="hidden"
            position="relative"
            width={['100%', '100%', '768px']}
        >
            <iframe ref={containerRef} height="100%" style={{ border: 'none', overflow: 'scroll' }} width="100%" />
        </Box>
    );
}
