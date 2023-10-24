import { motion } from 'framer-motion';
import { lazy, useContext, useEffect, useMemo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import styled from 'styled-components';

import { InvoiceChangeType } from 'checkout/backend';
import { ErrorBoundaryFallback } from 'checkout/components/ui';
import { ModalName, ModalState, ResultFormInfo, ResultType } from 'checkout/hooks';
import { PayableInvoiceData, useInvoiceEvents, useModal } from 'checkout/hooks';
import isNil from 'checkout/utils/is-nil';

import { ModalContext } from './modal-context';
import { PayableInvoiceContext } from './payable-invoice-context';
import { useInteractionModel } from './use-interaction-model';
import { InitialContext } from '../initial-context';

const Modal = lazy(() => import('./modal/modal'));

const UserInteractionModal = lazy(() => import('./user-interaction-modal/user-interaction-modal'));

const Container = styled.div`
    height: 100%;
    position: relative;
`;

const Modals = ({ modalState }: { modalState: ModalState[] }) => {
    const activeModalName = useMemo(() => modalState.find((modal) => modal.active).name, [modalState]);
    return (
        <ErrorBoundary fallback={<ErrorBoundaryFallback />}>
            {activeModalName === ModalName.modalForms && <Modal />}
            {activeModalName === ModalName.modalInteraction && <UserInteractionModal />}
        </ErrorBoundary>
    );
};

const ModalContainer = () => {
    const {
        appConfig: { capiEndpoint },
        initConfig,
        model: { serviceProviders, invoice, invoiceAccessToken },
        availablePaymentMethods,
    } = useContext(InitialContext);
    const {
        modalState,
        toInitialState,
        goToFormInfo,
        prepareToPay,
        prepareToRetry,
        forgetPaymentAttempt,
        setViewInfoError,
        toInteractionState,
    } = useModal({
        integrationType: initConfig.integrationType,
        availablePaymentMethods,
        serviceProviders,
    });
    const [payableInvoiceData, setPayableInvoiceData] = useState<PayableInvoiceData>(null);
    const { eventsState, startPolling, searchEventsChange } = useInvoiceEvents(capiEndpoint, payableInvoiceData);
    const { interactionModel, setPaymentInteraction, setPaymentStarted } = useInteractionModel();

    useEffect(() => {
        if (initConfig.integrationType === 'invoice') {
            setPayableInvoiceData({
                invoice: {
                    id: invoice.id,
                    dueDate: invoice.dueDate,
                    externalID: invoice.externalID,
                },
                invoiceAccessToken,
            });
        }
    }, []);

    useEffect(() => {
        if (isNil(payableInvoiceData)) return;
        if (eventsState.status === 'PRISTINE') {
            startPolling();
        }
        if (eventsState.status === 'POLLING_SUCCESS') {
            const change = eventsState.payload;
            switch (change.changeType) {
                case InvoiceChangeType.InvoiceCreated:
                    if (initConfig.integrationType === 'invoice') {
                        toInitialState();
                    }
                    if (initConfig.integrationType === 'invoiceTemplate') {
                        prepareToPay();
                    }
                    break;
                case InvoiceChangeType.PaymentInteractionRequested:
                    if (initConfig.skipUserInteraction) {
                        goToFormInfo(new ResultFormInfo(ResultType.hookTimeout));
                        break;
                    }
                    setPaymentInteraction(change);
                    searchEventsChange('PaymentStarted');
                    break;
                case InvoiceChangeType.InvoiceStatusChanged:
                case InvoiceChangeType.PaymentStatusChanged:
                    goToFormInfo(
                        new ResultFormInfo(ResultType.hookProcessed, {
                            change,
                        }),
                    );
                    break;
            }
        }
        if (eventsState.status === 'POLLING_TIMEOUT') {
            goToFormInfo(new ResultFormInfo(ResultType.hookTimeout));
        }
        if (eventsState.status === 'EVENT_CHANGE_FOUND') {
            setPaymentStarted(eventsState.payload);
        }
        if (eventsState.status === 'FAILURE') {
            goToFormInfo(
                new ResultFormInfo(ResultType.hookError, {
                    error: eventsState.error,
                }),
            );
        }
    }, [payableInvoiceData, eventsState]);

    useEffect(() => {
        if (isNil(interactionModel)) return;
        toInteractionState(interactionModel);
    }, [interactionModel]);

    return (
        <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 1 }}>
            <Container>
                <ModalContext.Provider
                    value={{
                        modalState,
                        goToFormInfo,
                        prepareToPay,
                        prepareToRetry,
                        forgetPaymentAttempt,
                        setViewInfoError,
                    }}
                >
                    <PayableInvoiceContext.Provider value={{ payableInvoiceData, setPayableInvoiceData }}>
                        {/* eslint-disable-next-line react/jsx-max-depth */}
                        <Modals modalState={modalState}></Modals>
                    </PayableInvoiceContext.Provider>
                </ModalContext.Provider>
            </Container>
        </motion.div>
    );
};

export default ModalContainer;
