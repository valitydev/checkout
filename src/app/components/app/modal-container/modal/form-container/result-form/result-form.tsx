import { useContext, useEffect, useMemo } from 'react';
import styled from 'styled-components';

import { Link } from 'checkout/components/ui';
import { FormName, ModalForms, ModalName, ResultFormInfo, ResultType } from 'checkout/hooks';
import { findNamed } from 'checkout/utils/find-named';
import isNil from 'checkout/utils/is-nil';

import { ActionBlock } from './action-block';
import { ResultFormType, makeContentInvoiceHook } from './make-content';
import { failedHook, pending } from './make-content/make-from-payment-change';
import { ResultIcon } from './result-icons';
import { InitialContext } from '../../../../initial-context';
import { ResultContext } from '../../../../result-context';
import { ModalContext } from '../../../modal-context';

const OthersButton = styled(Link)`
    padding-top: 12px;
`;

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

const Container = styled.div<{ $hasActions: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 0;
    gap: 24px;
`;

const ResultForm = ({ onMount }: { onMount: () => void }) => {
    const { locale, initConfig } = useContext(InitialContext);
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
                description: '',
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
        <Container $hasActions={hasActions}>
            <ResultIcon type={type} />
            <Title>{header}</Title>
            <Description> {description}</Description>
            {hasActions ? <ActionBlock /> : false}
            {initConfig?.redirectUrl && (
                <OthersButton onClick={() => window.open(initConfig.redirectUrl, '_self')}>
                    {locale['form.button.back.to.website']}
                </OthersButton>
            )}
        </Container>
    );
};

export default ResultForm;
