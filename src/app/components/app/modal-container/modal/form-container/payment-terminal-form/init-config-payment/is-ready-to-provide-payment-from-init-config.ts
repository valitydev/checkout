import isNil from 'lodash-es/isNil';

import { ServiceProviderMetadataField } from 'checkout/backend';
import { PaymentTerminalFormValues } from 'checkout/state';

export const isReadyToProvidePaymentFromInitConfig = (
    formValues: any,
    prepared: Partial<PaymentTerminalFormValues>,
    form: ServiceProviderMetadataField[]
): boolean => isNil(formValues) && Object.keys(prepared.metadata).length === form.length;
