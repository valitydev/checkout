import { useContext, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';

import {
    EventInteractionObject,
    ModalInteraction,
    ModalInteractionType,
    ModalName,
    TokenizedInteractionObject,
} from 'checkout/hooks';
import { findNamed, prepareForm } from 'checkout/utils';
import { device } from 'checkout/utils/device';

import { InitialContext } from '../../initial-context';
import { ModalContext } from '../modal-context';

const Container = styled.div`
    height: 100%; // for cross-browser 100vh
    height: 100vh;
    width: 100%;
    background: #fff;

    @media ${device.desktop} {
        height: 768px;
        width: 768px;
        position: relative;
        border-radius: 16px;
        overflow: hidden;
    }
`;

const IFrame = styled.iframe`
    display: block;
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: scroll;
    border: none;

    @media ${device.desktop} {
        border-radius: 16px;
        position: absolute;
    }
`;

export const UserInteractionModal = () => {
    const iFrameElement = useRef(null);
    const { origin } = useContext(InitialContext);
    const { modalState } = useContext(ModalContext);

    const modal = useMemo(() => findNamed(modalState, ModalName.modalInteraction) as ModalInteraction, [modalState]);

    useEffect(() => {
        const interactionObject = modal.interactionObject;
        if (interactionObject.type === ModalInteractionType.EventInteraction) {
            const form = prepareForm(origin, (interactionObject as EventInteractionObject).request);
            iFrameElement.current.contentWindow.document.body.appendChild(form);
            form.submit();
        }
    }, [modal]);

    const src = useMemo(() => {
        const interactionObject = modal?.interactionObject;
        let src: string;
        if (interactionObject && interactionObject.type === ModalInteractionType.TokenizedInteraction) {
            src = (interactionObject as TokenizedInteractionObject).uri;
        }
        return src;
    }, [modal]);

    return (
        <Container key="3ds" id="interact-container">
            <IFrame ref={iFrameElement} id="interactionFrame" src={src} />
        </Container>
    );
};
