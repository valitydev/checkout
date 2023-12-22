import { DestinationBankCard } from 'checkout/backend/p2p';

import { Container, Label, Row, Value } from './common-components';

export type DestinationInfoBankCardInfo = {
    destination: DestinationBankCard;
};

export const DestinationInfoBankCard = ({ destination }: DestinationInfoBankCardInfo) => {
    return (
        <Container>
            <Row>
                <Label>Card number:</Label>
                <Value>{destination.pan}</Value>
            </Row>
            {destination?.bankName && (
                <Row>
                    <Label>Bank name:</Label>
                    <Value>{destination.bankName}</Value>
                </Row>
            )}
        </Container>
    );
};
