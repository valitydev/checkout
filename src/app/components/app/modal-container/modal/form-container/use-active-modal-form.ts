import { useMemo } from 'react';

import { FormInfo, ModalForms, ModalName, ModalState } from 'checkout/state';
import { findNamed } from 'checkout/utils';

export const useActiveModalForm = <T extends FormInfo>(modalState: ModalState[]) =>
    useMemo(() => {
        const modalForms = findNamed(modalState, ModalName.modalForms);
        return (modalForms as ModalForms).formsInfo.find((i) => i.active) as T;
    }, [modalState]);
