import { MetadataFieldFormatter } from 'checkout/backend';
import { assertUnreachable } from 'checkout/utils';
import { formatNumbersOnly } from './format-numbers-only';

export const getMetadataFieldFormatter = (formatter: MetadataFieldFormatter) => {
    switch (formatter.type) {
        case 'numbersOnly':
            return formatNumbersOnly(formatter);
        default:
            assertUnreachable(formatter.type);
            return null;
    }
};
