import { Locale } from 'checkout/locale';

import { CopyToClipboard } from './CopyToClipboard';
import { DestinationBankAccount } from '../../../../common/backend/p2p';
import { Container, Label, Row, Value } from '../commonComponents';

export type DestinationInfoBankCardInfo = {
    locale: Locale;
    destination: DestinationBankAccount;
};

export const DestinationInfoBankAccount = ({ locale, destination }: DestinationInfoBankCardInfo) => (
    <Container>
        <Row>
            <Label>{locale['form.p2p.destination.bank.account.account']}</Label>
            <Row $gap={8}>
                <Value>{destination.account}</Value>
                <CopyToClipboard copyValue={destination.account} />
            </Row>
        </Row>
        {destination?.bankName && (
            <Row>
                <Label>{locale['form.p2p.destination.bank.account.bank']}</Label>
                <Value>{destination.bankName}</Value>
            </Row>
        )}
        {destination?.recipientName && (
            <Row>
                <Label>{locale['form.p2p.destination.bank.account.recipient']}</Label>
                <Value>{destination.recipientName}</Value>
            </Row>
        )}
    </Container>
);
