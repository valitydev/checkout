import { Alert, AlertDescription, AlertIcon } from '@chakra-ui/react';

import { Locale } from 'checkout/contexts';

export type P2PApiErrorProps = {
    l: Locale;
    fontSize?: string;
};

export function P2PApiError({ l, fontSize }: P2PApiErrorProps) {
    return (
        <Alert borderRadius="xl" status="error">
            <AlertIcon />
            <AlertDescription fontSize={fontSize || 'sm'}>{l['form.p2p.error']}</AlertDescription>
        </Alert>
    );
}
