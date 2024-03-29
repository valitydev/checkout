import { Grid } from '@chakra-ui/react';
import { useContext, useEffect, useMemo, useState } from 'react';

import { Gateway } from 'checkout/backend/p2p';
import { LocaleContext } from 'checkout/contexts';
import { isNil } from 'checkout/utils';

import { CardIcon } from './CardIcon';
import { IconPane } from './IconPane';

export type GatewayPanesProps = {
    gateways: Gateway[];
    onSelect: (gateway: Gateway | null) => void;
};

const DEFAULT_PANE_ID = 'defaultPaneId';

export function GatewayPanes({ gateways, onSelect }: GatewayPanesProps) {
    const { l } = useContext(LocaleContext);

    const [activeGatewayId, setActiveGatewayId] = useState<string | null>(null);

    useEffect(() => {
        if (isNil(activeGatewayId)) return;
        if (activeGatewayId === DEFAULT_PANE_ID) {
            onSelect(gateways[0]);
            return;
        }
        const found = gateways.find((gateway) => gateway.id === activeGatewayId);
        onSelect(found);
    }, [activeGatewayId]);

    const paneData = useMemo(() => {
        const defaultPane = {
            id: DEFAULT_PANE_ID,
            label: l['form.p2p.default.pane.label'],
            iconName: 'bankCard',
        };

        return [
            ...gateways.map((gateway) => ({
                id: gateway.id,
                label: gateway.name,
                iconName: 'test', // Consider making this dynamic if necessary
            })),
            defaultPane,
        ];
    }, [gateways]);

    return (
        <Grid gap="4" templateColumns="repeat(2, 1fr)">
            {paneData.map(({ id, label }) => (
                <IconPane
                    key={id}
                    icon={<CardIcon color="teal.600" />}
                    isActive={activeGatewayId === id}
                    label={label}
                    onClick={() => setActiveGatewayId(id)}
                />
            ))}
        </Grid>
    );
}
