import { ModalForms, ModalName, State } from 'checkout/state';
import { findNamed } from 'checkout/utils';

export const getCurrentModalFormSelector = (state: State) =>
    (findNamed(state.modals, ModalName.modalForms) as ModalForms).formsInfo.find((f) => f.active);
