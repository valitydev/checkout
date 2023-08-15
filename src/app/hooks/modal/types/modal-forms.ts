import { FormInfo, FormViewInfo, SlideDirection } from './form-info';
import { ModalName, ModalState } from './modal-state';

export class ModalForms extends ModalState {
    formsInfo: FormInfo[];
    viewInfo: FormViewInfo;

    constructor(formsInfo: FormInfo[], active: boolean, inProcess = false) {
        super();
        this.name = ModalName.modalForms;
        this.viewInfo = {
            slideDirection: SlideDirection.none,
            inProcess,
        };
        this.formsInfo = formsInfo;
        this.active = active;
    }
}
