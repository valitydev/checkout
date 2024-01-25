import { useContext, useEffect } from 'react';

import { useLocale } from './useLocale';
import { useViewModel } from './useViewModel';
import { ViewContainerInner } from './ViewContainerInner';
import { ViewModelContext } from './ViewModelContext';
import { CustomizationContext, LocaleContext, PaymentContext } from '../../common/contexts';
import { FormBlock, Info } from '../legacy';

export function ViewContainer() {
    const { state, load } = useLocale();
    const { localeCode, name, description } = useContext(CustomizationContext);
    const { paymentModel, paymentCondition, startPayment } = useContext(PaymentContext);
    const { viewModel, goTo } = useViewModel(localeCode, paymentModel, paymentCondition);

    useEffect(() => {
        load(localeCode);
    }, [localeCode]);

    return (
        <FormBlock>
            {state.status === 'SUCCESS' && (
                <LocaleContext.Provider value={{ l: state.data }}>
                    <Info description={description} l={state.data} name={name} viewAmount={viewModel.viewAmount}></Info>
                    <ViewModelContext.Provider value={{ viewModel, goTo, onSetPaymentPayload: startPayment }}>
                        <ViewContainerInner />
                    </ViewModelContext.Provider>
                </LocaleContext.Provider>
            )}
            {state.status === 'FAILURE' && <p>Load locale failure.</p>}
        </FormBlock>
    );
}
