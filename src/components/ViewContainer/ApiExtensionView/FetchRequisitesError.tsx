import { Button, Spacer, VStack } from '@chakra-ui/react';
import { useContext } from 'react';

import { LocaleContext, PaymentModelContext } from 'checkout/contexts';

import { P2PApiError } from './P2PApiError';

export function FetchRequisitesError() {
    const {
        paymentModel: { initContext },
    } = useContext(PaymentModelContext);
    const { l } = useContext(LocaleContext);

    return (
        <VStack alignItems="center" justifyContent="center" minH="md">
            <Spacer />
            <P2PApiError fontSize="md" l={l} />
            <Spacer />
            {initContext?.redirectUrl && (
                <Button
                    colorScheme="teal"
                    size="lg"
                    variant="link"
                    onClick={() => window.open(initContext.redirectUrl, '_self')}
                >
                    {l['form.button.back.to.website']}
                </Button>
            )}
        </VStack>
    );
}
