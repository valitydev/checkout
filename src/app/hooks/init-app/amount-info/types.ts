export type AmountInfo = {
    status: 'notKnown' | 'final';
    currencyCode: string;
    locale: string;
    minorValue?: number;
};
