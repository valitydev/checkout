import { TemplateExpression, parse } from 'uri-template';

import isString from 'checkout/utils/is-string';

const hasTerminationUriParam = (expression: TemplateExpression): boolean =>
    !!expression.params.find((param) => param.name === 'termination_uri');

export const hasTerminationUriTemplate = (value: any): boolean => {
    if (!isString(value)) {
        return false;
    }
    const { expressions } = parse(value);
    let result = false;
    if (expressions && expressions.length === 1) {
        const hasTermUri = hasTerminationUriParam(expressions[0]);
        if (!hasTermUri) {
            console.error(`termination_uri is not found. Value: ${value}`);
        }
        result = hasTermUri;
    }
    return result;
};

export const expandWithRedirect = (origin: string, template: string, decode: boolean = false): string => {
    const parsed = parse(template);
    const redirectUrl = `${origin}/v1/finish-interaction.html`;
    const expanded = parsed.expand({ termination_uri: redirectUrl });
    return decode ? decodeURIComponent(expanded) : expanded;
};
