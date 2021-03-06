import { QrCodeDisplayRequest } from 'checkout/backend';
import { FormInfo, FormName } from './form-info';

export class QrCodeInteractionFormInfo extends FormInfo {
    constructor(public request: QrCodeDisplayRequest) {
        super();
        this.name = FormName.qrCodeInteractionForm;
        this.active = true;
    }
}
