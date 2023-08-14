import { InvoiceChange } from 'checkout/backend';
import { FormInfo, FormName } from '../form-info';

export enum ResultType {
    hookError = 'hookError',
    hookProcessed = 'hookProcessed',
    hookTimeout = 'hookTimeout',
}

export type HookPayload = {
    error?: unknown;
    change?: InvoiceChange;
};

export class ResultFormInfo extends FormInfo {
    resultType: ResultType;
    hookPayload?: HookPayload;

    constructor(resultType: ResultType, hookPayload?: HookPayload) {
        super();
        this.name = FormName.resultForm;
        this.resultType = resultType;
        this.active = true;
        this.hookPayload = hookPayload;
    }
}
