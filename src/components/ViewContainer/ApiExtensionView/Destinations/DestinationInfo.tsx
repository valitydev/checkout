import { VStack, Alert, Text, Divider, AlertIcon } from '@chakra-ui/react';
import { useContext } from 'react';

import { Destination } from 'checkout/backend/p2p';
import { LocaleContext, PaymentConditionsContext, PaymentModelContext, ViewModelContext } from 'checkout/contexts';
import { InvoiceDetermined, PaymentCondition } from 'checkout/paymentCondition';

import { DestinationBankAccountInfo } from './DestinationBankAccountInfo';
import { DestinationQRCodeAccountInfo } from './DestinationQRCodeAccountInfo';
import { InfoItem } from './InfoItem';
import { formatCardPan, formatPhoneNumber } from './utils';
import { SBPIcon } from '../icons/SBPIcon';
import { getGatewayIcon, mapGatewayName } from '../utils';

const isInvoiceDetermined = (condition: PaymentCondition): condition is InvoiceDetermined =>
    condition.name === 'invoiceDetermined';

export type DestinationInfoProps = {
    destination: Destination;
};

export function DestinationInfo({ destination }: DestinationInfoProps) {
    const { l } = useContext(LocaleContext);
    const { viewAmount } = useContext(ViewModelContext);
    const { paymentModel } = useContext(PaymentModelContext);
    const { conditions } = useContext(PaymentConditionsContext);

    const {
        invoiceContext: { isAmountRandomized },
    } = conditions.find<InvoiceDetermined>(isInvoiceDetermined);

    const {
        paymentAmount: { currency },
    } = paymentModel;

    return (
        <VStack align="stretch">
            <VStack align="stretch">
                {isAmountRandomized && (
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
            {destination.destinationType === 'QRCode' && <DestinationQRCodeAccountInfo qrCode={destination.qrCode} />}
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
