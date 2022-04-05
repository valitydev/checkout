import * as React from 'react';

import { Method } from '../method';
import { Title } from '../title';
import { Text } from '../text';
import { Icon } from '../icon/icon';
import { FormName, KnownProviderCategories, OnlineBankingFormInfo, PaymentTerminalPaymentMethod } from 'checkout/state';
import { Locale } from 'checkout/locale';
import { PayAction, SetFormInfoAction } from './types';
import { payWithPaymentTerminal } from './pay-with-payment-terminal';

interface OnlineBankingProps {
    method: PaymentTerminalPaymentMethod;
    locale: Locale;
    setFormInfo: SetFormInfoAction;
    pay: PayAction;
}

const toOnlineBanking = (category: KnownProviderCategories, setFormInfo: SetFormInfoAction) =>
    setFormInfo(new OnlineBankingFormInfo(category, FormName.paymentMethods));

const provideMethod = (
    { serviceProviders, category }: PaymentTerminalPaymentMethod,
    pay: PayAction,
    setFormInfo: SetFormInfoAction
) =>
    serviceProviders.length === 1
        ? payWithPaymentTerminal(serviceProviders[0].id, pay)
        : toOnlineBanking(category, setFormInfo);

const getTitle = (l: Locale, category: KnownProviderCategories) => l[`form.payment.method.name.${category}.label`];

export const OnlineBankingMethodItem: React.FC<OnlineBankingProps> = ({ locale, method, pay, setFormInfo }) => (
    <Method onClick={() => provideMethod(method, pay, setFormInfo)}>
        <Icon name="online-banking" />
        <Text>
            <Title>{getTitle(locale, method.category)}</Title>
        </Text>
    </Method>
);
