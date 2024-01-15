import { useContext, useMemo } from 'react';

import { Destination } from 'checkout/backend';
import { Locale } from 'checkout/locale';
import { formatAmount } from 'checkout/utils';

import { DestinationInfoBankCard } from './destination-info-bank-card';
import { DestinationInfoSpb } from './destination-info-spb';
import { InitialContext } from '../../../../../initial-context';
import { Info, Container, Row, Label, Value, Alert } from '../common-components';

type DestinationInfoProps = {
    locale: Locale;
    destination: Destination;
};

export const DestinationInfo = ({ locale, destination }: DestinationInfoProps) => {
    const { amountInfo } = useContext(InitialContext);
    const formattedAmount = useMemo(() => formatAmount(amountInfo), [amountInfo]);

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
                <Value>{formattedAmount}</Value>
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
