import { VStack, Divider, Heading, Button, Spacer, Spinner, Flex } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';

import { Destination, Gateway } from 'checkout/backend/p2p';
import { LocaleContext, PaymentModelContext } from 'checkout/contexts';
import { isNil } from 'checkout/utils';

import { GatewayPanes } from './GatewayPanes';
import { ApiExtensionViewContext } from '../ApiExtensionViewContext';
import { P2PApiError } from '../P2PApiError';
import { useDestinations } from '../useDestinations';
import { useGateways } from '../useGateways';

export type GatewaySelectorProps = {
    onFetchDestinations: (destinations: Destination[]) => void;
};

export function GatewaySelectorTmp({ onFetchDestinations }: GatewaySelectorProps) {
    const { l } = useContext(LocaleContext);
    const { apiEndpoint, invoiceAccessToken, invoiceID, paymentId } = useContext(ApiExtensionViewContext);
    const {
        paymentModel: { initContext },
    } = useContext(PaymentModelContext);
    const { gatewaysState, getGateways } = useGateways(apiEndpoint, invoiceAccessToken, invoiceID, paymentId);
    const { destinationsState, getDestinations } = useDestinations(
        apiEndpoint,
        invoiceAccessToken,
        invoiceID,
        paymentId,
    );
    const [gateway, setGateway] = useState<Gateway | null>(null);

    useEffect(() => {
        getGateways();
    }, []);

    useEffect(() => {
        if (destinationsState.status === 'SUCCESS') {
            onFetchDestinations(destinationsState.data);
        }
    }, [destinationsState]);

    useEffect(() => {
        if (gatewaysState.status === 'SUCCESS') {
            if (gatewaysState.data.length === 1) {
                getDestinations(gatewaysState.data[0].id);
            }
            if (gatewaysState.data.length === 0) {
                getDestinations();
            }
        }
    }, [gatewaysState]);

    return (
        <VStack align="stretch" minH="md" spacing={5}>
            {gatewaysState.status === 'LOADING' && (
                <Flex alignItems="center" justifyContent="center">
                    <Spinner size="xl" />
                </Flex>
            )}

            {gatewaysState.status === 'SUCCESS' &&
                gatewaysState.data.length <= 1 &&
                destinationsState.status === 'LOADING' && (
                    <Flex alignItems="center" justifyContent="center">
                        <Spinner size="xl" />
                    </Flex>
                )}

            {gatewaysState.status === 'SUCCESS' && gatewaysState.data.length > 1 && (
                <>
                    <Heading as="h5" size="sm" textAlign="center">
                        {l['form.p2p.gateway.selector.heading']}
                    </Heading>
                    <Divider />
                    <GatewayPanes gateways={gatewaysState.data} onSelect={setGateway} />
                    <Spacer />
                    <Button
                        borderRadius="xl"
                        colorScheme="teal"
                        isDisabled={isNil(gateway) || destinationsState.status === 'FAILURE'}
                        isLoading={destinationsState.status === 'LOADING'}
                        size="lg"
                        onClick={() => getDestinations(gateway.id)}
                    >
                        {l['form.p2p.next.button']}
                    </Button>
                </>
            )}

            {gatewaysState.status === 'FAILURE' && (
                <VStack align="stretch" spacing={12}>
                    <P2PApiError />
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
            )}
            {destinationsState.status === 'FAILURE' && (
                <VStack align="stretch" spacing={12}>
                    <P2PApiError />
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
            )}
        </VStack>
    );
}
