import * as React from 'react';

import { PaymentTerminalBankCardFormInfo } from 'checkout/state';
import { Header } from '../header';
import { getActiveModalFormSelector, getAvailableTerminalPaymentMethodSelector } from 'checkout/selectors';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';

export const PaymentTerminalBankCardForm: React.FC = () => {
    const locale = useAppSelector((s) => s.config.locale);
    const { category } = useAppSelector<PaymentTerminalBankCardFormInfo>(getActiveModalFormSelector);
    const paymentMethod = useAppSelector(getAvailableTerminalPaymentMethodSelector(category));
    const serviceProviders = paymentMethod?.serviceProviders;
    console.log(serviceProviders);
    const dispatch = useAppDispatch();
    return (
        <form>
            <Header title={locale['form.header.pay.card.label']} />
        </form>
    );
};
