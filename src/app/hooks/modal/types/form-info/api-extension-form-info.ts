import { ApiExtensionRequest } from 'checkout/backend';

import { FormInfo, FormName } from './form-info';

export class ApiExtensionFormInfo extends FormInfo {
    constructor(
        public request: ApiExtensionRequest,
        public paymentID: string,
    ) {
        super();
        this.name = FormName.apiExtensionForm;
        this.active = true;
    }
}
