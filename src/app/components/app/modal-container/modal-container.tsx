import * as React from 'react';
import { useContext, useEffect, useMemo } from 'react';

import { Modal } from './modal';
import { UserInteractionModal } from './user-interaction-modal';
import { ModalName, State } from 'checkout/state';
import styled from 'checkout/styled-components';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { initializeModal, initializeEvents, initializeModel } from 'checkout/actions';
import isNil from 'checkout/utils/is-nil';
import { FadeInOutAnimation } from './fade-in-out-animation';
import { InitialContext } from '../initial-context';
import { RotateAnimation } from './rotate-animation';

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
            dispatch(initializeEvents(events));
            dispatch(initializeModel({ invoice, invoiceAccessToken }));
        }
    }, []);

    return (
        <FadeInOutAnimation enter={750} appear={750} leave={750}>
            <Container>
                {!isNil(modals) && (
                    <RotateAnimation enter={1000} leave={500} key={activeModalName}>
                        {activeModalName === ModalName.modalForms && <Modal />}
                        {activeModalName === ModalName.modalInteraction && <UserInteractionModal />}
                    </RotateAnimation>
                )}
            </Container>
        </FadeInOutAnimation>
    );
};
