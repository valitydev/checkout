import { useContext, useMemo } from 'react';

import {
    CustomizationContext,
    LocaleContext,
    PaymentConditionsContext,
    PaymentModelContext,
    ViewModelContext,
} from 'checkout/contexts';
import { formatAmount } from 'checkout/utils';

import { useViewModel } from './useViewModel';
import { ViewContainerInner } from './ViewContainerInner';
import { FormBlock, Info } from '../legacy';

export function ViewContainer() {
    const { name, description } = useContext(CustomizationContext);
    const { localeCode } = useContext(LocaleContext);
    const { conditions } = useContext(PaymentConditionsContext);
    const {
        paymentModel: { paymentAmount, paymentMethods },
    } = useContext(PaymentModelContext);
    const { viewModel, goTo, forward, backward } = useViewModel(paymentMethods, conditions);

    const viewAmount = useMemo(() => formatAmount(paymentAmount, localeCode), [localeCode]);

    return (
        <FormBlock>
            <Info description={description} name={name} viewAmount={viewAmount}></Info>
            <ViewModelContext.Provider value={{ viewModel, viewAmount, goTo, forward, backward }}>
                <ViewContainerInner />
            </ViewModelContext.Provider>
        </FormBlock>
    );
}
