import { CostType } from './cost-type';
import { InvoiceTemplateLineCost } from './invoice-template-line-cost';

export class InvoiceTemplateLineCostFixed extends InvoiceTemplateLineCost {
    costType: CostType.InvoiceTemplateLineCostFixed;
    amount: number;
    currency: string;
}
