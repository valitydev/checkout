import * as React from 'react';
import { useContext, useEffect, useMemo, useState } from 'react';

import isNil from 'checkout/utils/is-nil';
import { Modal } from './modal';
import { UserInteractionModal } from './user-interaction-modal';
import { ModalName, State } from 'checkout/state';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { initializeModal, initializeEvents } from 'checkout/actions';
import { InitialContext } from '../initial-context';
import { PayableInvoiceContext } from './payable-invoice-context';
import styled from 'checkout/styled-components';
import { RotateAnimation } from './rotate-animation';
import { FadeInOutAnimation } from './fade-in-out-animation';
import { PayableInvoiceData } from 'checkout/hooks';

const Container = styled.div`
    height: 100%;
    position: relative;
`;

export const ModalContainer = () => {
    const {
        initConfig,
        model: { events, serviceProviders, invoice, invoiceAccessToken },
        availablePaymentMethods
    } = useContext(InitialContext);
    const [payableInvoiceData, setPayableInvoiceData] = useState<PayableInvoiceData>(null);

    const modals = useAppSelector((s: State) => s.modals);
    const dispatch = useAppDispatch();

    const activeModalName = useMemo(() => {
        if (isNil(modals)) {
            return null;
        }
        return modals.find((modal) => modal.active).name;
    }, [modals]);

    useEffect(() => {
        dispatch(initializeModal(initConfig, events, availablePaymentMethods, serviceProviders));
        if (initConfig.integrationType === 'invoice') {
            setPayableInvoiceData({
                invoice: {
                    id: invoice.id,
                    dueDate: invoice.dueDate,
                    externalID: invoice.externalID
                },
                invoiceAccessToken
            });
            dispatch(initializeEvents(events));
        }
    }, []);

    return (
        <FadeInOutAnimation enter={750} appear={750} leave={750}>
            <Container>
                {!isNil(modals) && (
                    <RotateAnimation enter={1000} leave={500}>
                        <div key={activeModalName}>
                            <PayableInvoiceContext.Provider value={{ payableInvoiceData, setPayableInvoiceData }}>
                                {activeModalName === ModalName.modalForms && <Modal />}
                                {activeModalName === ModalName.modalInteraction && <UserInteractionModal />}
                            </PayableInvoiceContext.Provider>
                        </div>
                    </RotateAnimation>
                )}
            </Container>
        </FadeInOutAnimation>
    );
};
