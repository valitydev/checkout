import { FormInfo, ModalForms, ModalName, State } from 'checkout/state';
import { findNamed } from 'checkout/utils';

export const getActiveModalFormSelector = <T extends FormInfo>(state: State): T => {
    const modalForms = findNamed(state.modals, ModalName.modalForms);
    return (modalForms as ModalForms).formsInfo.find((i) => i.active) as T;
};
