import { CostAmountRange } from './cost-amount-range';
import { InvoiceTemplateLineCost } from './invoice-template-line-cost';

export class InvoiceTemplateLineCostRange extends InvoiceTemplateLineCost {
    range: CostAmountRange;
    currency: string;
}
