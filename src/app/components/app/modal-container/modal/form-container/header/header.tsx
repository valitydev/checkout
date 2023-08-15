import * as React from 'react';
import { useContext } from 'react';

import { ChevronButton } from 'checkout/components';
import { FormInfo, ModalForms, ModalName, ModalState } from 'checkout/hooks';
import { Direction } from 'checkout/hooks';
import { findInfoWithPrevious, findNamed } from 'checkout/utils';

import { ModalContext } from '../../../modal-context';
import { HeaderWrapper } from '../header-wrapper';
import { Title } from '../title';



const getDestination = (modals: ModalState[]): FormInfo => {
    const modalForms = findNamed(modals, ModalName.modalForms) as ModalForms;
    const withPrevious = findInfoWithPrevious(modals);
    return withPrevious ? (findNamed(modalForms.formsInfo, withPrevious.previous) as FormInfo) : null;
};

export const Header = ({ title }: { title: string }) => {
    const { modalState, goToFormInfo } = useContext(ModalContext);
    const destination = getDestination(modalState);

    return (
        <HeaderWrapper>
            {destination && (
                <ChevronButton
                    id="desktop-back-btn"
                    type="left"
                    onClick={() => goToFormInfo(destination, Direction.back)}
                />
            )}
            <Title>{title}</Title>
        </HeaderWrapper>
    );
};
