import { useContext, useEffect } from 'react';

import { useLocale } from './useLocale';
import { CustomizationContext, LocaleContext, PaymentModelContext } from '../../common/contexts';
import { FormBlock, Info } from '../legacy';

export function UnifiedContainer() {
    const { state, load } = useLocale();
    const { localeCode, name, description } = useContext(CustomizationContext);
    const { model } = useContext(PaymentModelContext);

    useEffect(() => {
        load(localeCode);
    }, [localeCode]);

    return (
        <FormBlock>
            {state.status === 'SUCCESS' && (
                <LocaleContext.Provider value={{ l: state.data }}>
                    <Info
                        description={description}
                        l={state.data}
                        localeCode={localeCode}
                        name={name}
                        paymentAmount={model.paymentAmount}
                    ></Info>
                </LocaleContext.Provider>
            )}
            {state.status === 'FAILURE' && <p>Load locale failure.</p>}
        </FormBlock>
    );
}
