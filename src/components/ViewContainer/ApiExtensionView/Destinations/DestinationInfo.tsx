import { VStack } from '@chakra-ui/react';
import { useContext } from 'react';

import { Destination } from 'checkout/backend/p2p';
import { LocaleContext, ViewModelContext } from 'checkout/contexts';

import { InfoItem } from './InfoItem';
import { SBPIcon } from './SBPIcon';
import { formatCardPan, formatPhoneNumber } from './utils';

export type DestinationInfoProps = {
    destination: Destination;
};

export function DestinationInfo({ destination }: DestinationInfoProps) {
    const { l } = useContext(LocaleContext);
    const { viewAmount } = useContext(ViewModelContext);

    return (
        <VStack align="stretch">
            <InfoItem label={l['form.p2p.destination.amount']} value={viewAmount} />
            {destination.destinationType === 'BankCard' && (
                <InfoItem
                    formatter={formatCardPan}
                    isCopyable={true}
                    label={l['form.p2p.destination.bank.card.pan']}
                    value={destination.pan}
                />
            )}
            {destination.destinationType === 'BankAccount' && (
                <InfoItem
                    isCopyable={true}
                    label={l['form.p2p.destination.bank.account.account']}
                    value={destination.account}
                />
            )}
            {destination.destinationType === 'DestinationSBP' && (
                <InfoItem
                    formatter={formatPhoneNumber}
                    icon={<SBPIcon />}
                    isCopyable={true}
                    label={l['form.p2p.destination.spb.phone']}
                    value={destination.phoneNumber}
                />
            )}
            {destination?.bankName && (
                <InfoItem label={l['form.p2p.destination.bank.name']} value={destination.bankName} />
            )}
            {destination?.recipientName && (
                <InfoItem label={l['form.p2p.destination.bank.recipient']} value={destination.recipientName} />
            )}
        </VStack>
    );
}
