import { useContext, useEffect, useMemo } from 'react';

import { useLocale } from './useLocale';
import { useViewModel } from './useViewModel';
import { ViewContainerInner } from './ViewContainerInner';
import {
    CustomizationContext,
    LocaleContext,
    PaymentConditionsContext,
    PaymentModelContext,
    ViewModelContext,
} from '../../common/contexts';
import { formatAmount } from '../../common/utils';
import { FormBlock, Info } from '../legacy';

export function ViewContainer() {
    const { localeState, loadLocale } = useLocale();
    const { localeCode, name, description } = useContext(CustomizationContext);
    const { conditions } = useContext(PaymentConditionsContext);
    const {
        paymentModel: { paymentAmount, paymentMethods },
    } = useContext(PaymentModelContext);
    const { viewModel, goTo, forward, backward } = useViewModel(paymentMethods, conditions);

    const viewAmount = useMemo(() => formatAmount(paymentAmount, localeCode), [localeCode]);

    useEffect(() => {
        loadLocale(localeCode);
    }, [localeCode]);

    return (
        <FormBlock>
            {localeState.status === 'SUCCESS' && (
                <LocaleContext.Provider value={{ l: localeState.data }}>
                    <Info description={description} l={localeState.data} name={name} viewAmount={viewAmount}></Info>
                    <ViewModelContext.Provider value={{ viewModel, viewAmount, goTo, forward, backward }}>
                        <ViewContainerInner />
                    </ViewModelContext.Provider>
                </LocaleContext.Provider>
            )}
            {localeState.status === 'FAILURE' && <p>Load locale failure.</p>}
        </FormBlock>
    );
}
