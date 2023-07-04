import * as React from 'react';
import { useContext, useEffect, useMemo } from 'react';
import { FormName, ModalForms, ModalName, ResultFormInfo, ResultType } from 'checkout/hooks';
import { ResultFormType, makeContentInvoiceHook } from './make-content';
import { failedHook, pending } from './make-content/make-from-payment-change';
import { ActionBlock } from './action-block';
import { ResultIcon } from './result-icons';
import styled, { css } from 'checkout/styled-components';
import { device } from 'checkout/utils/device';
import isNil from 'checkout/utils/is-nil';
import { findNamed } from 'checkout/utils/find-named';

import { InitialContext } from '../../../../initial-context';
import { ResultContext } from '../../../../result-context';
import { ModalContext } from '../../../modal-context';

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

export const ResultForm = ({ onMount }: { onMount: () => void }) => {
    const { locale } = useContext(InitialContext);
    const { setIsComplete } = useContext(ResultContext);
    const { modalState } = useContext(ModalContext);
    const { hasActions, type, header, description, hasDone } = useMemo(() => {
        const info = (findNamed(modalState, ModalName.modalForms) as ModalForms).formsInfo;
        const resultFormInfo = findNamed(info, FormName.resultForm) as ResultFormInfo;
        if (isNil(resultFormInfo)) {
            return {
                type: ResultFormType.WARNING,
                hasActions: false,
                hasDone: false,
                header: '',
                description: ''
            };
        }
        switch (resultFormInfo.resultType) {
            case ResultType.hookError:
                return failedHook(locale, resultFormInfo.hookPayload.error);
            case ResultType.hookProcessed:
                return makeContentInvoiceHook(locale, resultFormInfo.hookPayload.change);
            case ResultType.hookTimeout:
                return pending(locale);
        }
    }, [modalState, locale]);

    useEffect(() => {
        onMount();
    }, []);

    useEffect(() => {
        if (hasDone) {
            setIsComplete(true);
        }
    }, [hasDone]);

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
};
