import * as React from 'react';

import styled from 'checkout/styled-components';
import { UPILogo } from 'checkout/components/ui';

const LogoContainer = styled.div`
    height: 48px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const Logo: React.FC = () => (
    <LogoContainer>
        <UPILogo />
    </LogoContainer>
);
