import { FormInfo, FormName } from '../form-info';

export enum ResultType {
    error = 'error',
    processed = 'processed',
    hookError = 'hookError'
}

export class ResultFormInfo extends FormInfo {
    resultType: ResultType;
    hookError?: unknown;

    constructor(resultType: ResultType, hookError?: unknown) {
        super();
        this.name = FormName.resultForm;
        this.resultType = resultType;
        this.active = true;
        this.hookError = hookError;
    }
}
