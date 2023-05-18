import { ResultState, ErrorState, FormsState, ModalState, EventsState } from '.';

export interface State {
    readonly result: ResultState;
    readonly error: ErrorState;
    readonly form: FormsState;
    readonly modals: ModalState[];
    readonly events: EventsState;
}
