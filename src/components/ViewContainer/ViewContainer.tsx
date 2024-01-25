import { useCallback, useContext, useEffect } from 'react';

import { PaymentPayload } from './types';
import { useLocale } from './useLocale';
import { useViewModel } from './useViewModel';
import { ViewContainerInner } from './ViewContainerInner';
import { ViewModelContext } from './ViewModelContext';
import { CustomizationContext, LocaleContext, PaymentModelContext } from '../../common/contexts';
import { FormBlock, Info } from '../legacy';

export function ViewContainer() {
    const { state, load } = useLocale();
    const { localeCode, name, description } = useContext(CustomizationContext);
    const { initPaymentModel, paymentModelChange, startPayment } = useContext(PaymentModelContext);
    const { viewModel, goTo } = useViewModel(initPaymentModel, paymentModelChange);

    useEffect(() => {
        load(localeCode);
    }, [localeCode]);

    return (
        <FormBlock>
            {state.status === 'SUCCESS' && (
                <LocaleContext.Provider value={{ l: state.data }}>
                    <ViewModelContext.Provider value={{ viewModel, goTo, onSetPaymentPayload: startPayment }}>
                        <Info
                            description={description}
                            l={state.data}
                            name={name}
                            viewAmount={viewModel.viewAmount}
                        ></Info>
                        <ViewContainerInner />
                    </ViewModelContext.Provider>
                </LocaleContext.Provider>
            )}
            {state.status === 'FAILURE' && <p>Load locale failure.</p>}
        </FormBlock>
    );
}
