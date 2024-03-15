import { DestinationBankCard } from 'checkout/backend/p2p';
import { Locale } from 'checkout/contexts';

import { CopyToClipboard } from './CopyToClipboard';
import { Container, Label, Row, Value } from '../commonComponents';

export type DestinationInfoBankCardInfo = {
    locale: Locale;
    destination: DestinationBankCard;
};

export const DestinationInfoBankCard = ({ locale, destination }: DestinationInfoBankCardInfo) => (
    <Container>
        <Row>
            <Label>{locale['form.p2p.destination.bank.card.pan']}</Label>
            <Row $gap={8}>
                <Value>{destination.pan}</Value>
                <CopyToClipboard copyValue={destination.pan} />
            </Row>
        </Row>
        {destination?.bankName && (
            <Row>
                <Label>{locale['form.p2p.destination.bank.name']}</Label>
                <Value>{destination.bankName}</Value>
            </Row>
        )}
        {destination?.recipientName && (
            <Row>
                <Label>{locale['form.p2p.destination.bank.recipient']}</Label>
                <Value>{destination.recipientName}</Value>
            </Row>
        )}
    </Container>
);
