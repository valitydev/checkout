import { FormsState, ModalState } from '.';

export interface State {
    readonly form: FormsState;
    readonly modals: ModalState[];
}
