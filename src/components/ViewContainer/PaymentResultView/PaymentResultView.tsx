import { useContext } from 'react';
import styled from 'styled-components';

import { IconName } from './types';
import { getResultInfo } from './utils';
import { LocaleContext, PaymentConditionsContext, PaymentModelContext } from '../../../common/contexts';
import { isNil, last } from '../../../common/utils';
import { ErrorIcon, Link, SuccessIcon, WarningIcon } from '../../../components/legacy';

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

    const lastCondition = last(conditions);
    const { iconName, label, description } = getResultInfo(lastCondition);

    return (
        <>
            <Wrapper>
                <ResultIcon iconName={iconName} />
                <Label>{l[label]}</Label>
                {!isNil(description) && <Description>{l[description]}</Description>}
                {initContext?.redirectUrl && (
                    <OthersButton onClick={() => window.open(initContext.redirectUrl, '_self')}>
                        {l['form.button.back.to.website']}
                    </OthersButton>
                )}
            </Wrapper>
        </>
    );
}
