import { formatNumbersOnly } from './formatNumbersOnly';
import { MetadataFieldFormatter } from '../../../../../common/backend/payments';
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
