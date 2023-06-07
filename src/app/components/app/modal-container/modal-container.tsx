import * as React from 'react';
import { useContext, useEffect, useMemo, useState } from 'react';

import isNil from 'checkout/utils/is-nil';
import { Modal } from './modal';
import { UserInteractionModal } from './user-interaction-modal';
import { ModalName, ResultFormInfo, ResultType } from 'checkout/state';
import { useAppDispatch } from 'checkout/configure-store';
import { setModalState } from 'checkout/actions';
import { InitialContext } from '../initial-context';
import { PayableInvoiceContext } from './payable-invoice-context';
import styled from 'checkout/styled-components';
import { RotateAnimation } from './rotate-animation';
import { FadeInOutAnimation } from './fade-in-out-animation';
import { PayableInvoiceData, useInvoiceEvents, useModal } from 'checkout/hooks';
import { InvoiceChangeType } from 'checkout/backend';
import { provideInteraction } from 'checkout/sagas/provide-modal';
import { ModalContext } from './modal-context';

const Container = styled.div`
    height: 100%;
    position: relative;
`;

export const ModalContainer = () => {
    const {
        appConfig: { capiEndpoint },
        initConfig,
        model: { events, serviceProviders, invoice, invoiceAccessToken },
        availablePaymentMethods
    } = useContext(InitialContext);
    const { modalState, goToFormInfo, prepareToPay, setViewInfoError } = useModal({
        integrationType: initConfig.integrationType,
        availablePaymentMethods
    });
    const [payableInvoiceData, setPayableInvoiceData] = useState<PayableInvoiceData>(null);
    const { pollingState, startPolling } = useInvoiceEvents(capiEndpoint, payableInvoiceData);

    const dispatch = useAppDispatch();

    const activeModalName = useMemo(() => modalState.find((modal) => modal.active).name, [modalState]);

    useEffect(() => {
        // dispatch(initializeModal(initConfig, events, availablePaymentMethods, serviceProviders));
        if (initConfig.integrationType === 'invoice') {
            setPayableInvoiceData({
                invoice: {
                    id: invoice.id,
                    dueDate: invoice.dueDate,
                    externalID: invoice.externalID
                },
                invoiceAccessToken
            });
        }
    }, []);

    useEffect(() => {
        if (isNil(payableInvoiceData) || initConfig.skipUserInteraction) return;
        if (pollingState.status === 'PRISTINE') {
            startPolling();
        }
        if (pollingState.status === 'SUCCESS') {
            const { change, events } = pollingState.payload;
            switch (change.changeType) {
                case InvoiceChangeType.PaymentInteractionRequested:
                    dispatch(setModalState(provideInteraction(events, serviceProviders)));
                    break;
                case InvoiceChangeType.InvoiceStatusChanged:
                case InvoiceChangeType.PaymentStatusChanged:
                    goToFormInfo(
                        new ResultFormInfo(ResultType.hookProcessed, {
                            change
                        })
                    );
                    break;
            }
        }
        if (pollingState.status === 'TIMEOUT') {
            goToFormInfo(new ResultFormInfo(ResultType.hookTimeout));
        }
        if (pollingState.status === 'FAILURE') {
            goToFormInfo(
                new ResultFormInfo(ResultType.hookError, {
                    error: pollingState.error
                })
            );
        }
    }, [payableInvoiceData, pollingState]);

    return (
        <FadeInOutAnimation enter={750} appear={750} leave={750}>
            <Container>
                <RotateAnimation enter={1000} leave={500}>
                    <div key={activeModalName}>
                        <ModalContext.Provider value={{ modalState, goToFormInfo, prepareToPay, setViewInfoError }}>
                            <PayableInvoiceContext.Provider value={{ payableInvoiceData, setPayableInvoiceData }}>
                                {activeModalName === ModalName.modalForms && <Modal />}
                                {activeModalName === ModalName.modalInteraction && <UserInteractionModal />}
                            </PayableInvoiceContext.Provider>
                        </ModalContext.Provider>
                    </div>
                </RotateAnimation>
            </Container>
        </FadeInOutAnimation>
    );
};
