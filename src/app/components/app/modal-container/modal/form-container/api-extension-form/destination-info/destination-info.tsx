import { Destination } from 'checkout/backend';

import { DestinationInfoBankCard } from './destination-info-bank-card';
import { DestinationInfoSpb } from './destination-info-spb';

type DestinationInfoProps = {
    destination: Destination;
};

export const DestinationInfo = ({ destination }: DestinationInfoProps) => (
    <>
        {destination.destinationType === 'BankCard' && <DestinationInfoBankCard destination={destination} />}
        {destination.destinationType === 'SPB' && <DestinationInfoSpb destination={destination} />}
    </>
);
