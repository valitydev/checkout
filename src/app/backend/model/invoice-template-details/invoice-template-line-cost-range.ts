import { CostAmountRange } from './cost-amount-range';
import { CostType } from './cost-type';
import { InvoiceTemplateLineCost } from './invoice-template-line-cost';

export class InvoiceTemplateLineCostRange extends InvoiceTemplateLineCost {
    costType: CostType.InvoiceTemplateLineCostRange;
    range: CostAmountRange;
    currency: string;
}
