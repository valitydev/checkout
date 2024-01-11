import { DestinationBankCard } from 'checkout/backend/p2p';
import { Locale } from 'checkout/locale';

import { Container, Label, Row, Value } from './common-components';

export type DestinationInfoBankCardInfo = {
    locale: Locale;
    destination: DestinationBankCard;
};

export const DestinationInfoBankCard = ({ locale, destination }: DestinationInfoBankCardInfo) => (
    <Container>
        <Row>
            <Label>{locale['form.p2p.destination.bank.card.pan']}</Label>
            <Value>{destination.pan}</Value>
        </Row>
        {destination?.bankName && (
            <Row>
                <Label>{locale['form.p2p.destination.bank.name']}</Label>
                <Value>{destination.bankName}</Value>
            </Row>
        )}
    </Container>
);
