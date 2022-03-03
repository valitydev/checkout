import * as React from 'react';

import styled from 'checkout/styled-components';
import { Bank } from 'checkout/components';

const LogoContainer = styled.div`
    height: 48px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const BankLogo = styled(Bank)`
    width: 48px;
    height: 48px;
    path {
        fill: ${({ theme }) => theme.color.secondary[0.9]};
    }
`;

export const ProviderLogo: React.FC = () => (
    <LogoContainer>
        <BankLogo />
    </LogoContainer>
);
