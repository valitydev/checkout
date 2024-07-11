import { Spinner, VStack, Text } from '@chakra-ui/react';
import { useContext } from 'react';

import { LocaleContext } from 'checkout/contexts';
import { useLoaderMessage } from 'checkout/hooks';

export function RequisitesLoader() {
    const { l } = useContext(LocaleContext);
    const message = useLoaderMessage(l);

    return (
        <VStack alignItems="center" justifyContent="center" minH="md">
            <VStack align="center" minHeight={32} spacing={4}>
                <Spinner color="brand.500" emptyColor="brand.200" size="xl" speed="0.65s" thickness="4px" />
                {message !== '' && (
                    <Text color="bodyText" fontSize="md" fontWeight="medium" textAlign="center">
                        {message}
                    </Text>
                )}
            </VStack>
        </VStack>
    );
}
