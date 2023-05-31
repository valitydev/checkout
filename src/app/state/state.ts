import { ResultState, ErrorState, FormsState, ModalState } from '.';

export interface State {
    readonly result: ResultState;
    readonly error: ErrorState;
    readonly form: FormsState;
    readonly modals: ModalState[];
}
