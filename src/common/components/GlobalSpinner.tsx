import { Flex, Spinner, VStack, Text } from '@chakra-ui/react';

import { Locale } from 'checkout/contexts';
import { useLoaderMessage } from 'checkout/hooks';

export type GlobalSpinnerProps = {
    l: Locale;
};

export function GlobalSpinner({ l }: GlobalSpinnerProps) {
    const message = useLoaderMessage(l);

    return (
        <Flex alignItems="center" flexDirection="column" height="100dvh" justifyContent="center">
            <VStack align="center" minHeight={32} spacing={4}>
                <Spinner
                    alignItems="center"
                    color="brand.500"
                    emptyColor="brand.200"
                    size="xl"
                    speed="0.65s"
                    thickness="4px"
                />
                {message !== '' && (
                    <Text color="white" fontSize="lg" fontWeight="medium" textAlign="center">
                        {message}
                    </Text>
                )}
            </VStack>
        </Flex>
    );
}
