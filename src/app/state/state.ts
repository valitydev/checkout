import { ResultState, FormsState, ModalState } from '.';

export interface State {
    readonly result: ResultState;
    readonly form: FormsState;
    readonly modals: ModalState[];
}
