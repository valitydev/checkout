import { Destination } from 'checkout/backend';
import { Locale } from 'checkout/locale';

import { Info, Container } from '../common-components';
import { DestinationInfoBankCard } from './destination-info-bank-card';
import { DestinationInfoSpb } from './destination-info-spb';

type DestinationInfoProps = {
    locale: Locale;
    destination: Destination;
};

export const DestinationInfo = ({ locale, destination }: DestinationInfoProps) => (
    <Container>
        <Info>{locale['form.p2p.destination.info']}</Info>
        {destination.destinationType === 'BankCard' && (
            <DestinationInfoBankCard destination={destination} locale={locale} />
        )}
        {destination.destinationType === 'DestinationSBP' && (
            <DestinationInfoSpb destination={destination} locale={locale} />
        )}
    </Container>
);
