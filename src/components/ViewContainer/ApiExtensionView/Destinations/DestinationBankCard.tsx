import { VStack } from '@chakra-ui/react';
import { useContext } from 'react';

import { DestinationBankCard } from 'checkout/backend/p2p';
import { LocaleContext } from 'checkout/contexts';

import { InfoItem } from './InfoItem';

export type DestinationInfoBankCardProps = {
    destination: DestinationBankCard;
};

export function DestinationInfoBankCard({ destination }: DestinationInfoBankCardProps) {
    const { l } = useContext(LocaleContext);

    return (
        <VStack align="stretch">
            <InfoItem label={l['form.p2p.destination.bank.card.pan']} value={destination.pan} />
            {destination?.bankName && (
                <InfoItem label={l['form.p2p.destination.bank.name']} value={destination.bankName} />
            )}
            {destination?.recipientName && (
                <InfoItem label={l['form.p2p.destination.bank.recipient']} value={destination.recipientName} />
            )}
        </VStack>
    );
}
