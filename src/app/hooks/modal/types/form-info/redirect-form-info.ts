import { BrowserRequest } from 'checkout/backend';

import { FormInfo, FormName } from '../form-info';

export class RedirectFormInfo extends FormInfo {
    constructor(public request: BrowserRequest) {
        super();
        this.name = FormName.redirectForm;
        this.active = true;
    }
}
