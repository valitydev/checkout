/* eslint-disable react/jsx-max-depth */
import { VStack, Text, Heading, Button, Divider, Spacer, LightMode } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';

import { Destination } from 'checkout/backend/p2p';
import { LocaleContext, PaymentContext, PaymentModelContext } from 'checkout/contexts';

import { DestinationInfo } from './DestinationInfo';
import { P2PAlert } from './P2PAlert';
import { ApiExtensionViewContext } from '../ApiExtensionViewContext';
import { P2PApiError } from '../P2PApiError';
import { useComplete } from '../useComplete';

export type DestinationsProps = {
    destinations: Destination[];
};

export function Destinations({ destinations }: DestinationsProps) {
    const { l } = useContext(LocaleContext);
    const { apiEndpoint, invoiceAccessToken, invoiceID, paymentId } = useContext(ApiExtensionViewContext);
    const { startWaitingPaymentResult } = useContext(PaymentContext);
    const {
        paymentModel: { initContext },
    } = useContext(PaymentModelContext);

    const {
        completeState: { status },
        complete,
    } = useComplete(apiEndpoint, invoiceAccessToken, invoiceID, paymentId);

    useEffect(() => {
        if (status === 'SUCCESS') {
            startWaitingPaymentResult();
        }
    }, [status]);

    return (
        <VStack align="stretch" minH="md" spacing={5}>
            <Heading as="h5" size="sm" textAlign="center">
                {l['form.p2p.destinations.heading']}
            </Heading>
            <Divider />
            <P2PAlert />
            <VStack align="stretch" spacing={3}>
                <Text fontWeight="medium">{l['form.p2p.destination.info']}</Text>
                {destinations.map((destination, index) => (
                    <DestinationInfo key={index} destination={destination} />
                ))}
            </VStack>
            <Spacer />
            <VStack align="stretch" spacing={3}>
                <Text fontSize="sm" textAlign="center">
                    {l['form.p2p.complete.info']}
                </Text>
                <VStack align="stretch" spacing={5}>
                    <LightMode>
                        <Button
                            borderRadius="lg"
                            colorScheme="brand"
                            isLoading={status === 'LOADING' || status === 'SUCCESS'}
                            loadingText={l['form.p2p.complete.loading']}
                            size="lg"
                            onClick={complete}
                        >
                            {l['form.p2p.complete.button']}
                        </Button>
                        {status === 'SUCCESS' && initContext?.redirectUrl && (
                            <Button
                                colorScheme="brand"
                                size="lg"
                                variant="link"
                                onClick={() => window.open(initContext.redirectUrl, '_self')}
                            >
                                {l['form.button.back.to.website']}
                            </Button>
                        )}
                    </LightMode>
                </VStack>
                {status === 'FAILURE' && <P2PApiError l={l} />}
            </VStack>
        </VStack>
    );
}
