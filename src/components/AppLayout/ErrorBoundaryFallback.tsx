import { Alert, AlertDescription, AlertIcon, AlertTitle, Button } from '@chakra-ui/react';

export const ErrorBoundaryFallback = () => (
    <Alert
        alignItems="center"
        flexDirection="column"
        gap={3}
        height="250px"
        justifyContent="center"
        status="error"
        textAlign="center"
        variant="subtle"
    >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle fontSize="lg" mb={1} mt={4}>
            Something went wrong.
        </AlertTitle>
        <AlertDescription maxWidth="sm">Try reloading.</AlertDescription>
        <Button colorScheme="teal" onClick={() => location.reload()}>
            Reload
        </Button>
    </Alert>
);
