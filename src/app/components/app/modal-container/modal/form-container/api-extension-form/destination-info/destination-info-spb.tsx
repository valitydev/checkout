import { DestinationSBP } from 'checkout/backend';
import { Locale } from 'checkout/locale';

import { Container, Label, Row, Value } from './common-components';

export type DestinationInfoSpbProps = {
    locale: Locale;
    destination: DestinationSBP;
};

export const DestinationInfoSpb = ({ locale, destination }: DestinationInfoSpbProps) => (
    <Container>
        {destination?.bankName && (
            <Row>
                <Label>{locale['form.p2p.destination.spb.bank.name']}</Label>
                <Value>{destination.bankName}</Value>
            </Row>
        )}
        <Row>
            <Label>{locale['form.p2p.destination.spb.phone']}</Label>
            <Value>{destination.phoneNumber}</Value>
        </Row>
        {destination?.recipientName && (
            <Row>
                <Label>{locale['form.p2p.destination.spb.recipient']}</Label>
                <Value>{destination.recipientName}</Value>
            </Row>
        )}
    </Container>
);
