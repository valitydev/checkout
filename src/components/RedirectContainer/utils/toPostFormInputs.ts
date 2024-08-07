import { UserInteractionForm } from 'checkout/backend/payments';

import { expandWithRedirect } from './expandWithRedirect';

const createInput = (origin: string, formField: UserInteractionForm): HTMLInputElement => {
    const formParam = document.createElement('input');
    formParam.name = formField.key;
    formField.key === 'TermUrl'
        ? (formParam.value = expandWithRedirect(origin, formField.template))
        : (formParam.value = formField.template);
    return formParam;
};

export const toPostFormInputs = (origin: string, form: UserInteractionForm[]): HTMLInputElement[] =>
    form.map((field) => createInput(origin, field));
