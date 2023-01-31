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
import { goToFormInfo } from 'checkout/actions';
import { Locale } from 'checkout/locale';
import { ServiceProvidersGrid } from './service-providers-grid';

const Container = styled.div`
    min-height: 346px;
    display: flex;
    flex-direction: column;
`;

const navigate = (providerID: string) =>
    goToFormInfo(new PaymentTerminalFormInfo(providerID, FormName.paymentTerminalSelector));

const toHeader = (locale: Locale, category: KnownProviderCategories) => locale[`form.header.${category}.label`];

export const PaymentTerminalSelectorForm: React.FC = () => {
    const locale = useAppSelector(getLocaleSelector);
    const { category } = useAppSelector<PaymentTerminalSelectorFormInfo>(getActiveModalFormSelector);
    const paymentMethod = useAppSelector(getAvailableTerminalPaymentMethodSelector(category));
    const serviceProviders = paymentMethod?.serviceProviders;
    const dispatch = useAppDispatch();
    return (
        <Container>
            <Header title={toHeader(locale, category)} />
            {serviceProviders && (
                <ServiceProvidersGrid
                    serviceProviders={serviceProviders}
                    onPaneClick={(id) => dispatch(navigate(id))}
                />
            )}
        </Container>
    );
};
