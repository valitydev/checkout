import { TemplateType } from 'checkout/backend';

import { getAmountFromMultiLine } from './get-amount-from-multi-line';
import { getAmountFromSingleLine } from './get-amount-from-single-line';
import { resolveInvoiceTemplate } from './resolve-invoice-template';


jest.mock('./get-amount-from-single-line');
jest.mock('./get-amount-from-multi-line');

const getAmountFromSingleLineMocked = getAmountFromSingleLine as any;
const getAmountFromMultiLineMocked = getAmountFromMultiLine as any;

it('InvoiceTemplateSingleLine should call getAmountFromSingleLine', () => {
    const singleLine = {
        details: {
            templateType: TemplateType.InvoiceTemplateSingleLine,
        },
    } as any;
    getAmountFromSingleLineMocked.mockReturnValueOnce(singleLine.details);
    resolveInvoiceTemplate(singleLine, 111, 'ru');
    expect(getAmountFromSingleLineMocked).toBeCalledWith(singleLine.details, 111, 'ru');
});

it('InvoiceTemplateMultiLine should call getAmountFromMultiLine', () => {
    const multiLine = {
        details: {
            templateType: TemplateType.InvoiceTemplateMultiLine,
        },
    } as any;
    getAmountFromMultiLineMocked.mockReturnValueOnce(multiLine.details);
    resolveInvoiceTemplate(multiLine, 111, 'ru');
    expect(getAmountFromMultiLineMocked).toBeCalledWith(multiLine.details, 'ru');
});
