import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { FormName, ModalForms, ModalName, ResultFormInfo, ResultState, ResultType, State } from 'checkout/state';
import { goToFormInfo, setResult } from 'checkout/actions';
import { ResultFormProps } from './result-form-props';
import { findNamed } from 'checkout/utils';
import { makeContentError, makeContentInvoice, ResultFormContent } from './make-content';
import { ActionBlock } from './action-block';
import { IntegrationType } from 'checkout/config';
import { ResultIcon } from './result-icons';
import styled, { css } from 'checkout/styled-components';
import { device } from 'checkout/utils/device';

const Title = styled.h2`
    font-weight: 500;
    font-size: 32px;
    color: ${({ theme }) => theme.font.primaryColor};
    line-height: 48px;
    text-align: center;
    margin: 0;
`;

const Description = styled.p`
    font-weight: 500;
    font-size: 16px;
    color: ${({ theme }) => theme.font.primaryColor};
    line-height: 24px;
    text-align: center;
    margin: 0;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
`;

const Form = styled.form<{ hasActions: boolean }>`
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;
    align-items: center;
    padding: 25px 0;

    @media ${device.desktop} {
        // The amount of indentations from the top and bottom should be the same for different window sizes,
        // so that when the window size is changed, it does not break
        padding-top: 50px;

        ${({ hasActions }) =>
            !hasActions &&
            css`
                padding-bottom: 50px;
            `}
    }

    ${Container} {
        width: 100%;
    }
`;

class ResultFormDef extends React.Component<ResultFormProps> {
    render() {
        const { header, description, type, hasActions, hasDone } = this.makeContent();
        if (hasDone) {
            this.props.setResult(ResultState.done);
        }
        return (
            <Form hasActions={hasActions}>
                <Container>
                    <ResultIcon type={type} />
                    <Title>{header}</Title>
                    <Description> {description}</Description>
                    {hasActions ? <ActionBlock /> : false}
                </Container>
            </Form>
        );
    }

    private makeContent(): ResultFormContent {
        const { locale, events, error, resultFormInfo, integrationType } = this.props;
        switch (resultFormInfo.resultType) {
            case ResultType.error:
                return makeContentError(locale, error);
            case ResultType.processed:
                switch (integrationType) {
                    case IntegrationType.invoice:
                    case IntegrationType.invoiceTemplate:
                        return makeContentInvoice(locale, events.events, events.status, error);
                }
        }
    }
}

const mapStateToProps = (state: State) => {
    const info = (findNamed(state.modals, ModalName.modalForms) as ModalForms).formsInfo;
    return {
        events: state.events,
        integrationType: state.config.initConfig.integrationType,
        locale: state.config.locale,
        error: state.error ? state.error.error : null,
        resultFormInfo: findNamed(info, FormName.resultForm) as ResultFormInfo,
        hasMultiMethods: !!findNamed(info, FormName.paymentMethods)
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
    setResult: bindActionCreators(setResult, dispatch),
    goToFormInfo: bindActionCreators(goToFormInfo, dispatch)
});

export const ResultForm = connect(mapStateToProps, mapDispatchToProps)(ResultFormDef);
