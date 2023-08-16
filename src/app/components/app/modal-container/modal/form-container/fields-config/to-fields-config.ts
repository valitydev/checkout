import {
    InvoiceTemplate,
    InvoiceTemplateLineCostRange,
    InvoiceTemplateLineCostUnlim,
    InvoiceTemplateSingleLine,
} from 'checkout/backend';
import { InitConfig } from 'checkout/config';

import { AmountConfig, EmailConfig, FieldsConfig, PhoneNumberConfig } from './fields-config';

const toSingleLineAmountConfig = (c: InvoiceTemplateSingleLine): AmountConfig => {
    const result = { visible: false } as AmountConfig;
    switch (c.price.costType) {
        case 'InvoiceTemplateLineCostUnlim':
            result.visible = true;
            result.cost = c.price as InvoiceTemplateLineCostUnlim;
            break;
        case 'InvoiceTemplateLineCostRange':
            result.visible = true;
            result.cost = c.price as InvoiceTemplateLineCostRange;
            break;
    }
    return result;
};

const toTemplateAmountConfig = (c: InitConfig, t: InvoiceTemplate): AmountConfig => {
    switch (t.details.templateType) {
        case 'InvoiceTemplateSingleLine':
            return c.amount ? { visible: false } : toSingleLineAmountConfig(t.details as InvoiceTemplateSingleLine);
    }
    return { visible: false };
};

export const toAmountConfig = (c: InitConfig, template: InvoiceTemplate): AmountConfig => {
    switch (c.integrationType) {
        case 'invoiceTemplate':
            return toTemplateAmountConfig(c, template);
    }
    return { visible: false };
};

export const toPhoneNumberConfig = (phoneNumber: string): PhoneNumberConfig => {
    return phoneNumber ? { visible: false, value: phoneNumber } : { visible: true };
};

export const toEmailConfig = (email: string): EmailConfig => {
    return email ? { visible: false, value: email } : { visible: true };
};

export const toCardHolderConfig = (requireCardHolder: boolean | null) => ({
    visible: requireCardHolder === null ? true : requireCardHolder,
});

export const toFieldsConfig = (c: InitConfig, t: InvoiceTemplate): FieldsConfig => ({
    amount: toAmountConfig(c, t),
    email: toEmailConfig(c.email),
    cardHolder: toCardHolderConfig(c.requireCardHolder),
    phoneNumber: toPhoneNumberConfig(c.phoneNumber),
});
