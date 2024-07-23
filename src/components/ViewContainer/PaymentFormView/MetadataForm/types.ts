import { TerminalValuesMetadata } from 'checkout/paymentMgmt';
import { InitContextContactInfo } from 'checkout/paymentModel';

export type MetadataFormValues = {
    contactInfo?: InitContextContactInfo;
    metadata?: TerminalValuesMetadata;
};
