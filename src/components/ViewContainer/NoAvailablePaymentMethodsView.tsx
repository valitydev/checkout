import { VStack, Text } from '@chakra-ui/react';
import { useContext } from 'react';

import { LocaleContext } from 'checkout/contexts';

export function NoAvailablePaymentMethodsView() {
    const { l } = useContext(LocaleContext);

    return (
        <VStack align="stretch" minH="sm" spacing={5}>
            <Text fontSize="lg" fontWeight="medium" textAlign="center">
                {l['info.modal.no.available.payment.method']}
            </Text>
        </VStack>
    );
}
