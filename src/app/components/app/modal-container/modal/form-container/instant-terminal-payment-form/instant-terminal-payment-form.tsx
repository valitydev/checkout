import * as React from 'react';
import { useEffect } from 'react';

import styled from 'checkout/styled-components';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { pay } from 'checkout/actions';
import { PaymentMethodName } from 'checkout/backend';
import { InstantTerminalPaymentFormInfo, PaymentTerminalFormValues } from 'checkout/state';
import { getActiveModalFormSelector, getAvailableTerminalPaymentMethodSelector } from 'checkout/selectors';

const Container = styled.div`
    height: 360px;
`;

export const InstantTerminalPaymentForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const { category } = useAppSelector<InstantTerminalPaymentFormInfo>(getActiveModalFormSelector);
    const paymentMethod = useAppSelector(getAvailableTerminalPaymentMethodSelector(category));
    const serviceProvider = paymentMethod?.serviceProviders[0];

    useEffect(() => {
        dispatch(
            pay({
                method: PaymentMethodName.PaymentTerminal,
                values: {
                    provider: serviceProvider.id
                } as PaymentTerminalFormValues
            })
        );
    }, []);

    return <Container></Container>;
};
