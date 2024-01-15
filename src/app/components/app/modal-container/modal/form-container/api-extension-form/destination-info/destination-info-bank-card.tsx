import { DestinationBankCard } from 'checkout/backend/p2p';
import { Locale } from 'checkout/locale';

import { CopyToClipboard } from './copy-to-clipboard';
import { Container, Label, Row, Value } from '../common-components';

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
    </Container>
);
