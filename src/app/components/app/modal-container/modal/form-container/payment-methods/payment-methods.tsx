import * as React from 'react';
import { useContext, useMemo, useState } from 'react';

import { MethodsList } from './methods';
import { OtherPaymentMethodsLink } from './other-payment-methods-link';
import { Title } from '../title';
import { HeaderWrapper } from '../header-wrapper';
import { PaymentMethod } from 'checkout/hooks';

import { InitialContext } from '../../../../initial-context';

const sortByPriority = (methods: PaymentMethod[]): PaymentMethod[] =>
    methods.sort((m1, m2) => (m1.priority > m2.priority ? 1 : -1));

const sliceMethods = (methods: PaymentMethod[], showAll: boolean, limit = 3) =>
    showAll ? methods : methods.slice(0, limit);

export const PaymentMethods = () => {
    const { locale, availablePaymentMethods } = useContext(InitialContext);
    const [isShowAll, setIsShowAll] = useState(false);
    const allMethods = useMemo(() => sortByPriority(availablePaymentMethods), [availablePaymentMethods]);
    const visibleMethods = useMemo(() => sliceMethods(allMethods, isShowAll), [allMethods, isShowAll]);

    return (
        <form>
            <HeaderWrapper>
                <Title>{locale['form.header.payment.methods.label']}</Title>
            </HeaderWrapper>
            <MethodsList methods={visibleMethods} />
            {visibleMethods.length < allMethods.length && (
                <OtherPaymentMethodsLink onClick={() => setIsShowAll(true)} locale={locale} />
            )}
        </form>
    );
};
