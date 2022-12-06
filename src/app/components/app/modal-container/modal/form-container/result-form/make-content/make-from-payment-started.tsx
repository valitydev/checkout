import { Locale } from 'checkout/locale';
import { InvoiceEvent } from 'checkout/backend';
import { ResultFormContent, ResultFormType } from './result-form-content';
import { getInvoicePaymentDetails } from './payment-details';

const getDescription = (description: string, e: InvoiceEvent[]): string =>
    `${description} ${getInvoicePaymentDetails(e).info}.`;

const started = (l: Locale, e: InvoiceEvent[]): ResultFormContent => ({
    hasActions: false,
    hasDone: false,
    header: l['form.header.final.started.label'],
    description: getDescription(l['form.final.started.pay.text'], e),
    type: ResultFormType.WARNING
});

export const makeFromPaymentStarted = (l: Locale, e: InvoiceEvent[]): ResultFormContent => {
    return started(l, e);
};
