import * as React from 'react';
import { useContext } from 'react';

import { findInfoWithPrevious, findNamed } from 'checkout/utils';
import { FormInfo, ModalForms, ModalName, ModalState } from 'checkout/state';
import { HeaderWrapper } from '../header-wrapper';
import { Title } from '../title';
import { ChevronButton } from 'checkout/components';
import { Direction } from 'checkout/hooks';

import { ModalContext } from '../../../modal-context';

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
                    type="left"
                    onClick={() => goToFormInfo(destination, Direction.back)}
                    id="desktop-back-btn"
                />
            )}
            <Title>{title}</Title>
        </HeaderWrapper>
    );
};
