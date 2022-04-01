import * as React from 'react';

import { Method } from '../method';
import { Title } from '../title';
import { Text } from '../text';
import { Icon } from '../icon/icon';
import {
    FormInfo,
    FormName,
    KnownProviderCategories,
    OnlineBankingFormInfo,
    PaymentMethodName,
    PaymentTerminalFormValues,
    PaymentTerminalPaymentMethod
} from 'checkout/state';
import { Locale } from 'checkout/locale';
import { PaymentRequestedPayload } from 'checkout/actions';

type SetFormInfoAction = (formInfo: FormInfo) => any;
type PayAction = (payload: PaymentRequestedPayload) => any;

interface OnlineBankingProps {
    method: PaymentTerminalPaymentMethod;
    locale: Locale;
    setFormInfo: SetFormInfoAction;
    pay: PayAction;
}

const toOnlineBanking = (category: KnownProviderCategories, setFormInfo: SetFormInfoAction) =>
    setFormInfo(new OnlineBankingFormInfo(category, FormName.paymentMethods));

const payWithPaymentTerminal = (provider: string, pay: PayAction) =>
    pay({
        method: PaymentMethodName.PaymentTerminal,
        values: {
            provider
        } as PaymentTerminalFormValues
    });

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
