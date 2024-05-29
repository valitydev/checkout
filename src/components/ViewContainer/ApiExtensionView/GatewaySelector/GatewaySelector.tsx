import { VStack, Divider, Heading, Button, Spacer } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';

import { Destination, Gateway } from 'checkout/backend/p2p';
import { LocaleContext } from 'checkout/contexts';
import { isNil } from 'checkout/utils';

import { GatewayPanes } from './GatewayPanes';
import { PanesSkeleton } from './PanesSkeleton';
import { ApiExtensionViewContext } from '../ApiExtensionViewContext';
import { P2PApiError } from '../P2PApiError';
import { useDestinations } from '../useDestinations';
import { useGateways } from '../useGateways';

export type GatewaySelectorProps = {
    onFetchDestinations: (destinations: Destination[]) => void;
};

export function GatewaySelector({ onFetchDestinations }: GatewaySelectorProps) {
    const { l } = useContext(LocaleContext);
    const { apiEndpoint, invoiceAccessToken, invoiceID, paymentId } = useContext(ApiExtensionViewContext);
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

    // useEffect(() => {
    //     if (gatewaysState.status === 'SUCCESS' && gatewaysState.data.length === 1) {
    //         getDestinations(gatewaysState.data[0].id);
    //     }
    // }, [gatewaysState]);

    return (
        <VStack align="stretch" minH="md" spacing={5}>
            <Heading as="h5" size="sm" textAlign="center">
                {l['form.p2p.gateway.selector.heading']}
            </Heading>
            <Divider />
            {gatewaysState.status === 'LOADING' && <PanesSkeleton />}
            {gatewaysState.status === 'SUCCESS' && (
                <>
                    <GatewayPanes gateways={gatewaysState.data} onSelect={setGateway} />
                    <Spacer />
                    <Button
                        borderRadius="lg"
                        colorScheme="teal"
                        isDisabled={isNil(gateway) || destinationsState.status === 'FAILURE'}
                        isLoading={destinationsState.status === 'LOADING'}
                        size="lg"
                        onClick={() => getDestinations(gateway.id)}
                    >
                        {l['form.p2p.next.button']}
                    </Button>
                    {destinationsState.status === 'FAILURE' && <P2PApiError />}
                </>
            )}
            {gatewaysState.status === 'FAILURE' && <P2PApiError />}
        </VStack>
    );
}
