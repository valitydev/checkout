import * as React from 'react';

import { Modal } from '../modal';
import { Footer } from '../footer';
import { UserInteractionModal } from '../user-interaction-modal';
import { ModalName, State } from 'checkout/state';
import styled from 'checkout/styled-components';
import { device } from 'checkout/utils/device';
import { stylableTransition, LEAVE, ENTER, ACTIVE } from 'checkout/styled-transition';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { useContext, useEffect, useMemo } from 'react';
import { initializeModal, initializeEvents, initializeModel } from 'checkout/actions';
import isNil from 'checkout/utils/is-nil';

import { InitialContext } from '../../initial-context';

const interactionTransitionTime = '0.5s';

const Animation = styled(stylableTransition)`
    ${ENTER} {
        opacity: 0;

        @media ${device.desktop} {
            opacity: 1;
            transform: perspective(1000px) rotateY(90deg);
        }

        ${ACTIVE} {
            opacity: 1;
            transition: all ${interactionTransitionTime} ease-out;

            @media ${device.desktop} {
                transform: perspective(1000px) rotateY(0deg);
                transition-delay: ${interactionTransitionTime};
            }
        }
    }

    ${LEAVE} {
        opacity: 1;

        @media ${device.desktop} {
            transform: translateY(-50%) perspective(1000px) rotateY(0deg);
            position: absolute;
            top: 50%;
        }

        ${ACTIVE} {
            opacity: 0;
            transition: all ${interactionTransitionTime} ease-in;

            @media ${device.desktop} {
                opacity: 1;
                top: 50%;
                transform: translateY(-50%) perspective(1000px) rotateY(-90deg);
            }
        }
    }
`;

export const ModalContent = () => {
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
        <>
            {!isNil(modals) && (
                <Animation enter={1000} leave={500}>
                    <div key={activeModalName}>
                        {activeModalName === ModalName.modalForms && (
                            <>
                                <Modal />
                                <Footer />
                            </>
                        )}
                        {activeModalName === ModalName.modalInteraction && <UserInteractionModal />}
                    </div>
                </Animation>
            )}
        </>
    );
};
