import { useContext, useEffect, useMemo } from 'react';

import { useLocale } from './useLocale';
import { useViewModel } from './useViewModel';
import { ViewContainerInner } from './ViewContainerInner';
import {
    CustomizationContext,
    LocaleContext,
    PaymentContext,
    PaymentModelContext,
    ViewModelContext,
} from '../../common/contexts';
import { formatAmount } from '../../common/utils';
import { FormBlock, Info } from '../legacy';

export function ViewContainer() {
    const { state, load } = useLocale();
    const { localeCode, name, description } = useContext(CustomizationContext);
    const { paymentCondition, startPayment } = useContext(PaymentContext);
    const { paymentModel } = useContext(PaymentModelContext);
    const { viewModel, goTo } = useViewModel(paymentModel, paymentCondition);

    const viewAmount = useMemo(() => formatAmount(paymentModel.paymentAmount, localeCode), [localeCode]);

    useEffect(() => {
        load(localeCode);
    }, [localeCode]);

    return (
        <FormBlock>
            {state.status === 'SUCCESS' && (
                <LocaleContext.Provider value={{ l: state.data }}>
                    <Info description={description} l={state.data} name={name} viewAmount={viewAmount}></Info>
                    <ViewModelContext.Provider
                        value={{ viewModel, viewAmount, goTo, onSetPaymentPayload: startPayment }}
                    >
                        <ViewContainerInner />
                    </ViewModelContext.Provider>
                </LocaleContext.Provider>
            )}
            {state.status === 'FAILURE' && <p>Load locale failure.</p>}
        </FormBlock>
    );
}
