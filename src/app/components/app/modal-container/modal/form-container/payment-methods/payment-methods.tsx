import * as React from 'react';
import { useContext, useMemo, useState } from 'react';

import { FormName, PaymentMethod } from 'checkout/state';
import { goToFormInfo, pay } from 'checkout/actions';
import { useAppDispatch } from 'checkout/configure-store';
import { MethodsList } from './methods';
import { OtherPaymentMethodsLink } from './other-payment-methods-link';
import { Title } from '../title';
import { HeaderWrapper } from '../header-wrapper';

import { InitialContext } from '../../../../initial-context';

const sortByPriority = (methods: PaymentMethod[]): PaymentMethod[] =>
    methods.sort((m1, m2) => (m1.priority > m2.priority ? 1 : -1));

const sliceMethods = (methods: PaymentMethod[], showAll: boolean, limit = 3) =>
    showAll ? methods : methods.slice(0, limit);

export const PaymentMethods = () => {
    const context = useContext(InitialContext);
    const { locale, initConfig, availablePaymentMethods, amountInfo } = context;
    const [isShowAll, setIsShowAll] = useState(false);
    const allMethods = useMemo(() => sortByPriority(availablePaymentMethods), [availablePaymentMethods]);
    const visibleMethods = useMemo(() => sliceMethods(allMethods, isShowAll), [allMethods, isShowAll]);
    const dispatch = useAppDispatch();

    return (
        <form>
            <HeaderWrapper>
                <Title>{locale['form.header.payment.methods.label']}</Title>
            </HeaderWrapper>
            <MethodsList
                methods={visibleMethods}
                locale={locale}
                setFormInfo={(formInfo) => dispatch(goToFormInfo(formInfo))}
                pay={(payload) => dispatch(pay(payload))}
                amountPrefilled={amountInfo.status === 'final'}
                emailPrefilled={!!initConfig.email}
                phoneNumberPrefilled={!!initConfig.phoneNumber}
                prevFormName={FormName.paymentMethods}
                localeCode={initConfig.locale}
                context={context}
            />
            {visibleMethods.length < allMethods.length && (
                <OtherPaymentMethodsLink onClick={() => setIsShowAll(true)} locale={locale} />
            )}
        </form>
    );
};
