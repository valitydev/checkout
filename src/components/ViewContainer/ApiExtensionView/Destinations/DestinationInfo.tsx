import { VStack, Alert, Text, Divider, AlertIcon } from '@chakra-ui/react';
import { useContext } from 'react';

import { Destination } from 'checkout/backend/p2p';
import { LocaleContext, PaymentConditionsContext, PaymentModelContext, ViewModelContext } from 'checkout/contexts';
import { isNil } from 'checkout/utils';

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
    const { paymentModel } = useContext(PaymentModelContext);
    const { conditions } = useContext(PaymentConditionsContext);

    const invoiceDetermined = conditions.find((c) => c.name === 'invoiceDetermined');

    if (isNil(invoiceDetermined)) {
        throw new Error('DestinationInfo component should contain invoiceDetermined condition');
    }

    const isAmountRandomized = invoiceDetermined.invoiceContext.isAmountRandomized;

    const {
        paymentAmount: { currency },
    } = paymentModel;

    return (
        <VStack align="stretch">
            <VStack align="stretch">
                {!isAmountRandomized && (
                    <Alert borderRadius="xl" p={3} status="warning">
                        <AlertIcon />
                        <Text fontSize="sm">{l['form.p2p.destination.randomizeAmountDescription']}</Text>
                    </Alert>
                )}
                <InfoItem isDivider={false} label={l['form.p2p.destination.amount']} value={viewAmount} />
                <Divider />
            </VStack>
            {destination.destinationType === 'BankCard' && (
                <InfoItem
                    formatter={formatCardPan}
                    isCopyable={true}
                    label={l['form.p2p.destination.bank.card.pan']}
                    value={destination.pan}
                />
            )}
            {destination.destinationType === 'BankAccount' && <DestinationBankAccountInfo destination={destination} />}
            {(destination.destinationType === 'DestinationSBP' || destination.destinationType === 'SBP') && (
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
