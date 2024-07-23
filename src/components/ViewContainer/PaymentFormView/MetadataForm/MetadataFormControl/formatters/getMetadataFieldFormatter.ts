import { MetadataFieldFormatter } from 'checkout/backend/payments';
import { assertUnreachable } from 'checkout/utils';

import { formatNumbersOnly } from './formatNumbersOnly';

export const getMetadataFieldFormatter = (formatter: MetadataFieldFormatter) => {
    switch (formatter.type) {
        case 'numbersOnly':
            return formatNumbersOnly(formatter);
        default:
            assertUnreachable(formatter.type);
            return null;
    }
};
