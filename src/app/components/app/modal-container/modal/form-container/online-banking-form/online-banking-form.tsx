import * as React from 'react';

import {
    OnlineBankingAccountFormInfo,
    OnlineBankingFormInfo,
    OnlineBankingPaymentMethod,
    OnlineBankingSubtype,
    PaymentMethodName
} from 'checkout/state';
import { Locale } from 'checkout/locale';
import { goToFormInfo } from 'checkout/actions';
import { Header } from '../header';
import { BanksList } from './banks-list';
import { getActiveModalFormSelector, getAvailablePaymentMethodSelector } from 'checkout/selectors';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';

const getTitle = (l: Locale, subtype: OnlineBankingSubtype) => l[`form.payment.method.name.${subtype}.label`];

const getPaymentMethodName = (subtype: OnlineBankingSubtype): PaymentMethodName => {
    switch (subtype) {
        case 'netBanking':
            return PaymentMethodName.NetBanking;
        case 'onlineBanking':
            return PaymentMethodName.OnlineBanking;
    }
};

export const OnlineBankingForm: React.FC = () => {
    const locale = useAppSelector((s) => s.config.locale);
    const { name, subtype } = useAppSelector<OnlineBankingFormInfo>(getActiveModalFormSelector);
    const paymentMethod = useAppSelector<OnlineBankingPaymentMethod>(
        getAvailablePaymentMethodSelector(getPaymentMethodName(subtype))
    );
    const serviceProviders = paymentMethod?.serviceProviders;
    const dispatch = useAppDispatch();
    return (
        <form>
            <Header title={getTitle(locale, subtype)} />
            {serviceProviders ? (
                <BanksList
                    items={paymentMethod.serviceProviders}
                    select={(item) => dispatch(goToFormInfo(new OnlineBankingAccountFormInfo(item, name)))}
                />
            ) : null}
        </form>
    );
};
