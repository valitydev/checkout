import { toInitialModal } from './to-initial-modal';
import { ModalState, PaymentMethodsFormInfo, ResultFormInfo, ResultType } from 'checkout/state';

export const toModalResult = (): ModalState =>
    toInitialModal([new PaymentMethodsFormInfo(false), new ResultFormInfo(ResultType.processed)]);
