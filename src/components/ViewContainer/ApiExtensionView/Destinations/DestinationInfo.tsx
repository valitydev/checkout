import { VStack } from '@chakra-ui/react';
import { useContext } from 'react';

import { Destination } from 'checkout/backend/p2p';
import { LocaleContext, PaymentModelContext, ViewModelContext } from 'checkout/contexts';

import { DestinationBankAccountInfo } from './DestinationBankAccountInfo';
import { InfoItem } from './InfoItem';
import { formatCardPan, formatPhoneNumber } from './utils';
import { SBPIcon } from '../icons/SBPIcon';
import { getGatewayIcon, mapGatewayName } from '../utils';

export type DestinationInfoProps = {
    destination: Destination;
};

export function DestinationInfo({ destination }: DestinationInfoProps) {
    const { l } = useContext(LocaleContext);
    const { viewAmount } = useContext(ViewModelContext);

    const {
        paymentModel: {
            paymentAmount: { currency },
        },
    } = useContext(PaymentModelContext);

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
            {destination.destinationType === 'BankAccount' && <DestinationBankAccountInfo destination={destination} />}
            {destination.destinationType === 'DestinationSBP' && (
                <InfoItem
                    formatter={formatPhoneNumber}
                    icon={currency === 'RUB' ? <SBPIcon /> : null}
                    isCopyable={true}
                    label={l['form.p2p.destination.spb.phone']}
                    value={destination.phoneNumber}
                />
            )}
            {destination?.bankName && (
                <InfoItem
                    icon={getGatewayIcon(destination.bankName)}
                    label={l['form.p2p.destination.bank.name']}
                    value={mapGatewayName(destination.bankName, l)}
                />
            )}
            {destination?.recipientName && (
                <InfoItem label={l['form.p2p.destination.bank.recipient']} value={destination.recipientName} />
            )}
        </VStack>
    );
}
