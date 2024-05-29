import { Flex, Spinner, VStack } from '@chakra-ui/react';

import { Locale } from 'checkout/contexts';

import { LoaderMessage } from './LoaderMessage';

export type GlobalSpinnerProps = {
    l: Locale;
};

export function GlobalSpinner({ l }: GlobalSpinnerProps) {
    return (
        <Flex alignItems="center" flexDirection="column" height="100dvh" justifyContent="center">
            <VStack align="center" minHeight={32} spacing={4}>
                <Spinner
                    alignItems="center"
                    color="yellow.300"
                    emptyColor="orange.400"
                    size="xl"
                    speed="0.65s"
                    thickness="4px"
                />
                <LoaderMessage l={l} />
            </VStack>
        </Flex>
    );
}
