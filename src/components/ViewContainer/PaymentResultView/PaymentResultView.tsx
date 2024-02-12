import { useContext, useEffect } from 'react';
import styled from 'styled-components';

import { IconName } from './types';
import { getResultInfo } from './utils';
import {
    CompletePaymentContext,
    LocaleContext,
    PaymentConditionsContext,
    PaymentModelContext,
} from '../../../common/contexts';
import { isNil, last } from '../../../common/utils';
import { Button, ErrorIcon, Link, SuccessIcon, WarningIcon } from '../../../components/legacy';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 0;
    gap: 24px;
`;

const Label = styled.h2`
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

const OthersButton = styled(Link)`
    padding-top: 12px;
`;

const ResultIcon = ({ iconName }: { iconName: IconName }) => (
    <>
        {iconName === 'SuccessIcon' && <SuccessIcon />}
        {iconName === 'WarningIcon' && <WarningIcon />}
        {iconName === 'ErrorIcon' && <ErrorIcon />}
    </>
);

export function PaymentResultView() {
    const { l } = useContext(LocaleContext);
    const { conditions } = useContext(PaymentConditionsContext);
    const {
        paymentModel: { initContext },
    } = useContext(PaymentModelContext);
    const { onComplete } = useContext(CompletePaymentContext);

    const lastCondition = last(conditions);
    const { iconName, label, description, hasActions } = getResultInfo(lastCondition);

    useEffect(() => {
        switch (lastCondition.name) {
            case 'invoiceStatusChanged':
                if (lastCondition.status === 'paid') {
                    onComplete();
                }
                break;
            case 'paymentStatusChanged':
                if (lastCondition.status === 'processed' || lastCondition.status === 'captured') {
                    onComplete();
                }
                break;
        }
    }, [onComplete, lastCondition]);

    return (
        <>
            <Wrapper>
                <ResultIcon iconName={iconName} />
                <Label>{l[label]}</Label>
                {!isNil(description) && <Description>{l[description]}</Description>}
                {hasActions && (
                    <Button color="primary" onClick={() => location.reload()}>
                        {l['form.button.reload']}
                    </Button>
                )}
                {initContext?.redirectUrl && (
                    <OthersButton onClick={() => window.open(initContext.redirectUrl, '_self')}>
                        {l['form.button.back.to.website']}
                    </OthersButton>
                )}
            </Wrapper>
        </>
    );
}
