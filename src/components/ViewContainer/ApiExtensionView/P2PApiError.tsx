import { Alert, AlertDescription, AlertIcon } from '@chakra-ui/react';
import { useContext } from 'react';

import { LocaleContext } from 'checkout/contexts';

export function P2PApiError() {
    const { l } = useContext(LocaleContext);
    return (
        <Alert borderRadius="xl" status="error">
            <AlertIcon />
            <AlertDescription fontSize="sm">{l['form.p2p.error']}</AlertDescription>
        </Alert>
    );
}
