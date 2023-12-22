import { DestinationSBP } from 'checkout/backend';

import { Container, Label, Row, Value } from './common-components';

export type DestinationInfoSpbProps = {
    destination: DestinationSBP;
};

export const DestinationInfoSpb = ({ destination }: DestinationInfoSpbProps) => {
    return (
        <Container>
            <Row>
                <Label>Phone number:</Label>
                <Value>{destination.phoneNumber}</Value>
            </Row>
            {destination?.recipientName && (
                <Row>
                    <Label>Recipient name:</Label>
                    <Value>{destination.recipientName}</Value>
                </Row>
            )}
            {destination?.bankName && (
                <Row>
                    <Label>Bank name:</Label>
                    <Value>{destination.bankName}</Value>
                </Row>
            )}
        </Container>
    );
};
