import { Locale } from 'checkout/locale';
import { ResultFormContent, ResultFormType } from './result-form-content';

const started = (l: Locale): ResultFormContent => ({
    hasActions: false,
    hasDone: false,
    header: l['form.header.final.started.label'],
    description: l['form.final.started.pay.text'],
    type: ResultFormType.WARNING
});

export const makeFromPaymentStarted = (l: Locale): ResultFormContent => started(l);
