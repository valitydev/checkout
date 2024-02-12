import { useContext } from 'react';
import styled from 'styled-components';

import { LocaleContext, PaymentConditionsContext } from '../../common/contexts';
import { isNil, last } from '../../common/utils';
import { Button, ErrorIcon } from '../legacy';

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

const isResponseErrorWithMessage = (error: any): boolean => {
    if (isNil(error)) return false;
    return !isNil(error?.details?.message);
};

const getErrorDescription = (error: any): string => {
    if (error instanceof Error) {
        return `${error.name}: ${error.message}`;
    }
    if (isResponseErrorWithMessage(error)) {
        return error.details.message;
    }
    return JSON.stringify(error);
};

export function PaymentProcessFailedView() {
    const { l } = useContext(LocaleContext);
    const { conditions } = useContext(PaymentConditionsContext);

    const lastCondition = last(conditions);

    if (lastCondition.name !== 'paymentProcessFailed') {
        throw new Error(`Wrong payment condition type. Expected: paymentProcessStarted, actual: ${lastCondition.name}`);
    }

    return (
        <Wrapper>
            <ErrorIcon />
            <Label>{l['form.header.final.error.label']}</Label>
            <Description>{getErrorDescription(lastCondition.exception)}</Description>
            <Button color="primary" onClick={() => location.reload()}>
                {l['form.button.reload']}
            </Button>
        </Wrapper>
    );
}
