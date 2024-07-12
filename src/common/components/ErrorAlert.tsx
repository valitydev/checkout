import { Alert, AlertDescription, AlertIcon, AlertTitle, Button } from '@chakra-ui/react';

type ErrorAlertProps = {
    title: string;
    description: string;
    isReloading: boolean;
};

export function ErrorAlert({ title, description, isReloading }: ErrorAlertProps) {
    return (
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
                {title}
            </AlertTitle>
            <AlertDescription maxWidth="lg">{description}</AlertDescription>
            {isReloading && (
                <Button colorScheme="gray" onClick={() => location.reload()}>
                    Reload
                </Button>
            )}
        </Alert>
    );
}
