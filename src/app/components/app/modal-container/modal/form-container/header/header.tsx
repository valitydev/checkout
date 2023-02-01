import { bindActionCreators, Dispatch } from 'redux';
import * as React from 'react';
import { connect } from 'react-redux';

import { Direction, goToFormInfo } from 'checkout/actions';
import { findInfoWithPrevious, findNamed } from 'checkout/utils';
import { FormInfo, ModalForms, ModalName, ModalState, State } from 'checkout/state';
import { HeaderWrapper } from '../header-wrapper';
import { Title } from '../title';
import { ChevronButton } from 'checkout/components';

export interface HeaderProps {
    title: string;
    goToFormInfo: (formInfo: FormInfo, direction: Direction) => any;
    destination: FormInfo;
}

const getDestination = (modals: ModalState[]): FormInfo => {
    const modalForms = findNamed(modals, ModalName.modalForms) as ModalForms;
    const withPrevious = findInfoWithPrevious(modals);
    return withPrevious ? (findNamed(modalForms.formsInfo, withPrevious.previous) as FormInfo) : null;
};

const mapStateToProps = (state: State) => ({
    destination: getDestination(state.modals)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    goToFormInfo: bindActionCreators(goToFormInfo, dispatch)
});

const HeaderDef: React.FC<HeaderProps> = (props) => (
    <HeaderWrapper>
        {props.destination && (
            <ChevronButton
                type="left"
                onClick={props.goToFormInfo.bind(null, props.destination, Direction.back)}
                id="desktop-back-btn"
            />
        )}
        <Title>{props.title}</Title>
    </HeaderWrapper>
);

export const Header = connect(mapStateToProps, mapDispatchToProps)(HeaderDef);
