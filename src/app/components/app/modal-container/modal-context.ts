import { createContext } from 'react';

import { FormInfo, ModalState } from 'checkout/hooks';
import { Direction } from 'checkout/hooks/use-modal';

export const ModalContext = createContext<{
    modalState: ModalState[];
    goToFormInfo: (formInfo: FormInfo, direction?: Direction) => void;
    prepareToPay: () => void;
    prepareToRetry: (resetFormData: boolean) => void;
    forgetPaymentAttempt: () => void;
    setViewInfoError: (hasError: boolean) => void;
}>(null);
