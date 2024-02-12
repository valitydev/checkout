import { useContext } from 'react';

import { Destination } from 'checkout/backend';
import { Locale } from 'checkout/locale';

import { DestinationInfoBankCard } from './DestinationInfoBankCard';
import { DestinationInfoSpb } from './DestinationInfoSpb';
import { ViewModelContext } from '../../../../common/contexts';
import { Info, Container, Row, Label, Value, Alert } from '../commonComponents';

type DestinationInfoProps = {
    locale: Locale;
    destination: Destination;
};

export const DestinationInfo = ({ locale, destination }: DestinationInfoProps) => {
    const { viewAmount } = useContext(ViewModelContext);

    return (
        <Container>
            <Alert>
                <ul>
                    {locale['form.p2p.alert.li'].map((value, key) => (
                        <li key={key}>{value}</li>
                    ))}
                </ul>
                <p>{locale['form.p2p.alert.p']}</p>
            </Alert>
            <Info>{locale['form.p2p.destination.info']}</Info>
            <Row>
                <Label>{locale['form.p2p.destination.amount']}</Label>
                <Value>{viewAmount}</Value>
            </Row>
            {destination.destinationType === 'BankCard' && (
                <DestinationInfoBankCard destination={destination} locale={locale} />
            )}
            {destination.destinationType === 'DestinationSBP' && (
                <DestinationInfoSpb destination={destination} locale={locale} />
            )}
        </Container>
    );
};
