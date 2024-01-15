import { DestinationSBP } from 'checkout/backend';
import { Locale } from 'checkout/locale';

import { CopyToClipboard } from './copy-to-clipboard';
import { Container, Label, Row, Value } from '../common-components';

export type DestinationInfoSpbProps = {
    locale: Locale;
    destination: DestinationSBP;
};

export const DestinationInfoSpb = ({ locale, destination }: DestinationInfoSpbProps) => (
    <Container>
        <Row>
            <Label>{locale['form.p2p.destination.spb.phone']}</Label>
            <Row $gap={8}>
                <Value>{destination.phoneNumber}</Value>
                <CopyToClipboard copyValue={destination.phoneNumber} />
            </Row>
        </Row>
        {destination?.bankName && (
            <Row>
                <Label>{locale['form.p2p.destination.spb.bank.name']}</Label>
                <Value>{destination.bankName}</Value>
            </Row>
        )}
        {destination?.recipientName && (
            <Row>
                <Label>{locale['form.p2p.destination.spb.recipient']}</Label>
                <Value>{destination.recipientName}</Value>
            </Row>
        )}
    </Container>
);
