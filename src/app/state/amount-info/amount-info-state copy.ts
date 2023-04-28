import { AmountInfoStatus } from './amount-info-type';

export interface AmountInfoState {
    status: AmountInfoStatus;
    currencyCode: string;
    locale: string;
    minorValue?: number;
}
