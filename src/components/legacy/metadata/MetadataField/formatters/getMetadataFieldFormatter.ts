import { MetadataFieldFormatter } from 'checkout/backend';

import { formatNumbersOnly } from './formatNumbersOnly';
import { assertUnreachable } from '../../../../../common/utils';

export const getMetadataFieldFormatter = (formatter: MetadataFieldFormatter) => {
    switch (formatter.type) {
        case 'numbersOnly':
            return formatNumbersOnly(formatter);
        default:
            assertUnreachable(formatter.type);
            return null;
    }
};
