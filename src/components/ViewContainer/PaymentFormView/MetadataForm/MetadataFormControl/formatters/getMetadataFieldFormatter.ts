import { MetadataFieldFormatter } from 'checkout/backend/payments';

import { formatNumbersOnly } from './formatNumbersOnly';
import { formatPhoneNumber } from './formatPhoneNumber';

export const getMetadataFieldFormatter = (formatter: MetadataFieldFormatter) => {
    switch (formatter.type) {
        case 'numbersOnly':
            return formatNumbersOnly(formatter);
        case 'phoneNumber':
            return formatPhoneNumber(formatter);
        default:
            return null;
    }
};
