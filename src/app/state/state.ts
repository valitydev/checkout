import { ResultState, ModelState, ErrorState, FormsState, ModalState, EventsState } from '.';

export interface State {
    readonly result: ResultState;
    readonly model: ModelState;
    readonly error: ErrorState;
    readonly form: FormsState;
    readonly modals: ModalState[];
    readonly events: EventsState;
}
