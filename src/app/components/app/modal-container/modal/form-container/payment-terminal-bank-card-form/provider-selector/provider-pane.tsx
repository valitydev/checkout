import * as React from 'react';

import styled, { css } from 'checkout/styled-components';
import { ProviderIcon } from './provider-icon';
import { BankCardProviderID } from './provider-selector';

const ProviderPaneContainer = styled.div<{ isActive: boolean; isError: boolean }>`
    cursor: pointer;

    width: 78px;
    height: 46px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.neutral[0.2]};

    display: flex;
    align-items: center;
    justify-content: center;

    :hover {
        border-color: ${({ theme }) => theme.color.primary[1]};
    }

    ${({ isActive }) => {
        if (isActive) {
            return css`
                border: 2px solid ${({ theme }) => theme.color.primary[1]};
            `;
        }
    }}

    ${({ isError }) => {
        if (isError) {
            return css`
                border-color: ${({ theme }) => theme.color.error[1]};
            `;
        }
    }}
`;

export interface ProviderPaneProps {
    providerID: BankCardProviderID;
    isActive: boolean;
    isError: boolean;
}

export const ProviderPane: React.FC<ProviderPaneProps> = ({ providerID, isActive, isError }) => (
    <ProviderPaneContainer isActive={isActive} isError={isError}>
        <ProviderIcon providerID={providerID} />
    </ProviderPaneContainer>
);
