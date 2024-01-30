import { BrowserGetRequest } from 'checkout/backend';

import { expandWithRedirect, hasTerminationUriTemplate } from './expandWithRedirect';
import { getEncodedUrlParams } from '../getEncodedUrlParams';

const createInput = (name: string, value: any): HTMLInputElement => {
    const formParam = document.createElement('input');
    formParam.name = name;
    formParam.value = value;
    return formParam;
};

export const toGetFormInputs = (origin: string, request: BrowserGetRequest): HTMLInputElement[] => {
    const params = getEncodedUrlParams(request.uriTemplate);
    return Object.keys(params).map((fieldName) => {
        const value = params[fieldName];
        return hasTerminationUriTemplate(value)
            ? createInput(fieldName, expandWithRedirect(origin, value, true))
            : createInput(fieldName, decodeURIComponent(value));
    });
};
