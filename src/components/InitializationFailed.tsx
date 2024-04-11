import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@chakra-ui/react';

import { extractError } from 'checkout/utils';

export type InitializationFailedProps = {
    error: unknown;
};

export function InitializationFailed({ error }: InitializationFailedProps) {
    console.error(`Application Initialization Failed: ${extractError(error)}`, error);
    return (
        <Alert
            alignItems="center"
            flexDirection="column"
            height="200px"
            justifyContent="center"
            status="error"
            textAlign="center"
            variant="subtle"
        >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle fontSize="lg" mb={1} mt={4}>
                Application Initialization Failed!
            </AlertTitle>
            <AlertDescription maxWidth="sm">{extractError(error)}</AlertDescription>
        </Alert>
    );
}
