import { Locale } from 'checkout/locale';

import { CopyToClipboard } from './CopyToClipboard';
import { DestinationBankCard } from '../../../../common/backend/p2p';
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
