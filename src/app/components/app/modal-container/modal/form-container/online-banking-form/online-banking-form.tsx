import * as React from 'react';

import { OnlineBankingAccountFormInfo } from 'checkout/state';
import { goToFormInfo } from 'checkout/actions';
import { Header } from '../header';
import { BanksList } from './banks-list';
import { getCurrentModalFormSelector } from 'checkout/selectors/get-current-modal-form-selector';
import { getOnlineBankingPaymentMethodSelector } from 'checkout/selectors/get-online-banking-payment-method-selector';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';

export const OnlineBankingForm: React.FC = () => {
    const paymentMethod = useAppSelector(getOnlineBankingPaymentMethodSelector);
    const locale = useAppSelector((s) => s.config.locale);
    const formInfo = useAppSelector(getCurrentModalFormSelector);
    const dispatch = useAppDispatch();

    return (
        <form>
            <Header title={locale['form.payment.method.name.onlineBanking.label']} />
            <BanksList
                items={paymentMethod.serviceProviders}
                select={(item) => dispatch(goToFormInfo(new OnlineBankingAccountFormInfo(item, formInfo.name)))}
            />
        </form>
    );
};
