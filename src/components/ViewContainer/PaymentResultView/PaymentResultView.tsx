import { useContext } from 'react';
import styled from 'styled-components';

import { LocaleContext } from '../../../common/contexts';
import { isNil } from '../../../common/utils';
import { ErrorIcon, SuccessIcon, WarningIcon } from '../../../components/legacy';
import { PaymentResultView as PaymentResultViewType } from '../types';
import { ViewModelContext } from '../ViewModelContext';

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

const ResultIcon = ({ iconName }: { iconName: PaymentResultViewType['iconName'] }) => (
    <>
        {iconName === 'Success' && <SuccessIcon />}
        {iconName === 'Warning' && <WarningIcon />}
        {iconName === 'Error' && <ErrorIcon />}
    </>
);

export function PaymentResultView() {
    const { l } = useContext(LocaleContext);
    const { viewModel } = useContext(ViewModelContext);
    const view = viewModel.views.get('PaymentResultView');

    return (
        <>
            {view.name === 'PaymentResultView' && (
                <Wrapper>
                    <ResultIcon iconName={view.iconName} />
                    <Label>{l[view.label]}</Label>
                    {!isNil(view.description) && <Description>{view.description}</Description>}
                </Wrapper>
            )}
        </>
    );
}
