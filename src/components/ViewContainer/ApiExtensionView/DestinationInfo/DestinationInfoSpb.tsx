import { CopyToClipboard } from './CopyToClipboard';
import { DestinationSBP } from '../../../../common/backend/p2p';
import { Locale } from '../../../../common/contexts';
import { Container, Label, Row, Value } from '../commonComponents';

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
