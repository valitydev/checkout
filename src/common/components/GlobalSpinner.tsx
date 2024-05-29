import { Flex, Spinner } from '@chakra-ui/react';

export function GlobalSpinner() {
    return (
        <Flex alignItems="center" flexDirection="column" height="100dvh" justifyContent="center">
            <Spinner
                alignItems="center"
                color="yellow.300"
                emptyColor="orange.400"
                size="xl"
                speed="0.65s"
                thickness="4px"
            />
        </Flex>
    );
}
