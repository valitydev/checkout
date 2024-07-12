import { VStack, Divider, Heading, Button, Spacer } from '@chakra-ui/react';
import { useContext, useState } from 'react';

import { Gateway } from 'checkout/backend/p2p';
import { LocaleContext } from 'checkout/contexts';
import { isNil } from 'checkout/utils';

import { GatewayPanes } from './GatewayPanes';

export type GatewaySelectorProps = {
    gateways: Gateway[];
    onSelect: (gatewayId: string) => void;
};

export function GatewaySelector({ gateways, onSelect }: GatewaySelectorProps) {
    const { l } = useContext(LocaleContext);
    const [gateway, setGateway] = useState<Gateway | null>(null);

    return (
        <VStack align="stretch" minH="md" spacing={5}>
            <Heading as="h5" size="sm" textAlign="center">
                {l['form.p2p.gateway.selector.heading']}
            </Heading>
            <Divider />
            <GatewayPanes gateways={gateways} onSelect={setGateway} />
            <Spacer />
            <Button
                borderRadius="lg"
                colorScheme="brand"
                isDisabled={isNil(gateway)}
                size="lg"
                onClick={() => onSelect(gateway.id)}
            >
                {l['form.p2p.next.button']}
            </Button>
        </VStack>
    );
}
