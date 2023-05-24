import * as React from 'react';
import { useContext, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { FormName, ModalForms, ModalName, ResultFormInfo, ResultState, ResultType } from 'checkout/state';
import { setResult } from 'checkout/actions';
import { findNamed } from 'checkout/utils';
import { makeContentError, makeContentInvoice } from './make-content';
import { failedHook } from './make-content/make-from-payment-change';
import { ActionBlock } from './action-block';
import { ResultIcon } from './result-icons';
import styled, { css } from 'checkout/styled-components';
import { device } from 'checkout/utils/device';

import { InitialContext } from '../../../../initial-context';

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

export const ResultForm = () => {
    const { locale } = useContext(InitialContext);
    const { resultFormInfo, error, events } = useAppSelector((s) => {
        const info = (findNamed(s.modals, ModalName.modalForms) as ModalForms).formsInfo;
        return {
            resultFormInfo: findNamed(info, FormName.resultForm) as ResultFormInfo,
            hasMultiMethods: !!findNamed(info, FormName.paymentMethods),
            events: s.events,
            error: s.error ? s.error.error : null
        };
    });
    const dispatch = useAppDispatch();

    const { hasActions, type, header, description, hasDone } = useMemo(() => {
        switch (resultFormInfo.resultType) {
            case ResultType.error:
                return makeContentError(locale, error);
            case ResultType.hookError:
                return failedHook(locale, resultFormInfo.hookError);
            case ResultType.processed:
                return makeContentInvoice(locale, events.events, events.status, error);
        }
    }, [resultFormInfo, locale, error, events]);

    useEffect(() => {
        if (hasDone) {
            dispatch(setResult(ResultState.done));
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
