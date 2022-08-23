import * as React from 'react';
import styled from 'checkout/styled-components';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';

import { Header } from '../header';
import {
    FormName,
    KnownProviderCategories,
    PaymentTerminalFormInfo,
    PaymentTerminalSelectorFormInfo
} from 'checkout/state';
import {
    getActiveModalFormSelector,
    getAvailableTerminalPaymentMethodSelector,
    getLocaleSelector
} from 'checkout/selectors';
import { ServiceProviderPane } from './service-provider-pane';
import { goToFormInfo } from 'checkout/actions';
import { Locale } from 'checkout/locale';

const Container = styled.div`
    min-height: 300px;
    display: flex;
    flex-direction: column;
`;

const Grid = styled.div`
    display: grid;
    grid-gap: 16px;
    grid-template-columns: 1fr 1fr;
`;

const navigate = (providerID: string) =>
    goToFormInfo(new PaymentTerminalFormInfo(providerID, FormName.paymentTerminalSelector));

const toHeader = (locale: Locale, category: KnownProviderCategories) => locale[`form.header.${category}.label`];

export const PaymentTerminalSelectorForm: React.FC = () => {
    const locale = useAppSelector(getLocaleSelector);
    const { category } = useAppSelector<PaymentTerminalSelectorFormInfo>(getActiveModalFormSelector);
    const paymentMethod = useAppSelector(getAvailableTerminalPaymentMethodSelector(category));
    const dispatch = useAppDispatch();
    return (
        <Container>
            <Header title={toHeader(locale, category)} />
            <Grid>
                {paymentMethod?.serviceProviders.map((p, i) => (
                    <ServiceProviderPane key={i} serviceProvider={p} onClick={(id) => dispatch(navigate(id))} />
                ))}
            </Grid>
        </Container>
    );
};
