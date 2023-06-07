import * as React from 'react';
import { useContext } from 'react';
import styled from 'checkout/styled-components';

import { Header } from '../header';
import { FormName, PaymentTerminalFormInfo, PaymentTerminalSelectorFormInfo } from 'checkout/state';
import { Locale } from 'checkout/locale';
import { ServiceProvidersGrid } from './service-providers-grid';
import { getAvailableTerminalPaymentMethod } from '../get-available-terminal-payment-method';
import { KnownProviderCategories } from 'checkout/hooks';

import { ModalContext } from '../../../modal-context';
import { InitialContext } from '../../../../initial-context';
import { useActiveModalForm } from '../use-active-modal-form';

const Container = styled.div`
    min-height: 346px;
    display: flex;
    flex-direction: column;
`;

const toHeader = (locale: Locale, category: KnownProviderCategories) => locale[`form.header.${category}.label`];

export const PaymentTerminalSelectorForm: React.FC = () => {
    const { locale, availablePaymentMethods } = useContext(InitialContext);
    const { modalState, goToFormInfo } = useContext(ModalContext);
    const { category } = useActiveModalForm<PaymentTerminalSelectorFormInfo>(modalState);
    const paymentMethod = getAvailableTerminalPaymentMethod(availablePaymentMethods, category);
    const serviceProviders = paymentMethod?.serviceProviders;

    return (
        <Container>
            <Header title={toHeader(locale, category)} />
            {serviceProviders && (
                <ServiceProvidersGrid
                    serviceProviders={serviceProviders}
                    onPaneClick={(providerID) =>
                        goToFormInfo(new PaymentTerminalFormInfo(providerID, FormName.paymentTerminalSelector))
                    }
                />
            )}
        </Container>
    );
};
