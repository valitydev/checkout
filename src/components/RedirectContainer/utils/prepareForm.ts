import { BrowserRequest } from 'checkout/backend/payments';

import { toGetFormInputs } from './toGetFormInputs';
import { toPostFormInputs } from './toPostFormInputs';

const toInputs = (origin: string, request: BrowserRequest): HTMLInputElement[] => {
    switch (request.requestType) {
        case 'BrowserPostRequest':
            return toPostFormInputs(origin, request.form);
        case 'BrowserGetRequest':
            return toGetFormInputs(origin, request);
    }
};

const toMethod = (request: BrowserRequest): 'POST' | 'GET' => {
    switch (request.requestType) {
        case 'BrowserPostRequest':
            return 'POST';
        case 'BrowserGetRequest':
            return 'GET';
    }
};

export const prepareForm = (
    origin: string,
    request: BrowserRequest,
    target: '_self' | '_blank' = '_self',
): HTMLFormElement => {
    const form = document.createElement('form');
    form.action = request.uriTemplate;
    form.method = toMethod(request);
    toInputs(origin, request).forEach((input) => form.appendChild(input));
    form.setAttribute('target', target);
    form.style.visibility = 'hidden';
    return form;
};
