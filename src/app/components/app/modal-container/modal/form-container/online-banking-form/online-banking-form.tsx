import * as React from 'react';

import { OnlineBankingAccountFormInfo, OnlineBankingFormInfo, KnownProviderCategories } from 'checkout/state';
import { Locale } from 'checkout/locale';
import { goToFormInfo } from 'checkout/actions';
import { Header } from '../header';
import { BanksList } from './banks-list';
import { getActiveModalFormSelector, getAvailableTerminalPaymentMethodSelector } from 'checkout/selectors';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';

const getTitle = (l: Locale, category: KnownProviderCategories) => l[`form.payment.method.name.${category}.label`];

export const OnlineBankingForm: React.FC = () => {
    const locale = useAppSelector((s) => s.config.locale);
    const { name, category } = useAppSelector<OnlineBankingFormInfo>(getActiveModalFormSelector);
    const paymentMethod = useAppSelector(getAvailableTerminalPaymentMethodSelector(category));
    const serviceProviders = paymentMethod?.serviceProviders;
    const dispatch = useAppDispatch();
    return (
        <form>
            <Header title={getTitle(locale, category)} />
            {serviceProviders ? (
                <BanksList
                    items={paymentMethod.serviceProviders}
                    select={(item) => dispatch(goToFormInfo(new OnlineBankingAccountFormInfo(item, name)))}
                />
            ) : null}
        </form>
    );
};
