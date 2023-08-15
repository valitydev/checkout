import { useContext, useEffect } from 'react';
import styled from 'styled-components';

import { FormName, PaymentTerminalFormInfo, PaymentTerminalSelectorFormInfo } from 'checkout/hooks';
import { KnownProviderCategories } from 'checkout/hooks';
import { Locale } from 'checkout/locale';

import { ServiceProvidersGrid } from './service-providers-grid';
import { InitialContext } from '../../../../initial-context';
import { ModalContext } from '../../../modal-context';
import { getAvailableTerminalPaymentMethod } from '../get-available-terminal-payment-method';
import { Header } from '../header';
import { useActiveModalForm } from '../use-active-modal-form';

const Container = styled.div`
    min-height: 346px;
    display: flex;
    flex-direction: column;
`;

const toHeader = (locale: Locale, category: KnownProviderCategories) => locale[`form.header.${category}.label`];

export const PaymentTerminalSelectorForm = ({ onMount }: { onMount: () => void }) => {
    const { locale, availablePaymentMethods } = useContext(InitialContext);
    const { modalState, goToFormInfo } = useContext(ModalContext);
    const { category } = useActiveModalForm<PaymentTerminalSelectorFormInfo>(modalState);
    const paymentMethod = getAvailableTerminalPaymentMethod(availablePaymentMethods, category);
    const serviceProviders = paymentMethod?.serviceProviders;

    useEffect(() => {
        onMount();
    }, []);

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
