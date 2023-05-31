import { InvoiceChange } from 'checkout/backend';
import { toInitialModal } from './to-initial-modal';
import { ModalState, ResultFormInfo, ResultType } from 'checkout/state';

export const toModalResult = (change: InvoiceChange): ModalState =>
    toInitialModal([new ResultFormInfo(ResultType.hookProcessed, { change })]);
