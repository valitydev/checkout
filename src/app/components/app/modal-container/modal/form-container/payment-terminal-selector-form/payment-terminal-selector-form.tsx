import * as React from 'react';
import { useContext } from 'react';
import styled from 'checkout/styled-components';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';

import { Header } from '../header';
import { FormName, PaymentTerminalFormInfo, PaymentTerminalSelectorFormInfo } from 'checkout/state';
import { getActiveModalFormSelector } from 'checkout/selectors';
import { goToFormInfo } from 'checkout/actions';
import { Locale } from 'checkout/locale';
import { ServiceProvidersGrid } from './service-providers-grid';

import { InitialContext } from '../../../../initial-context';
import { getAvailableTerminalPaymentMethod } from '../get-available-terminal-payment-method';
import { KnownProviderCategories } from 'checkout/hooks';

const Container = styled.div`
    min-height: 346px;
    display: flex;
    flex-direction: column;
`;

const navigate = (providerID: string) =>
    goToFormInfo(new PaymentTerminalFormInfo(providerID, FormName.paymentTerminalSelector));

const toHeader = (locale: Locale, category: KnownProviderCategories) => locale[`form.header.${category}.label`];

export const PaymentTerminalSelectorForm: React.FC = () => {
    const { locale, availablePaymentMethods } = useContext(InitialContext);
    const { category } = useAppSelector<PaymentTerminalSelectorFormInfo>(getActiveModalFormSelector);
    const paymentMethod = getAvailableTerminalPaymentMethod(availablePaymentMethods, category);
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
