import * as React from 'react';

import { ChevronLeft } from 'checkout/components';
import styled from 'checkout/styled-components';

const ChevronBackWrapper = styled.div`
    g {
        stroke: ${({ theme }) => theme.chevronBack.color};
    }
    :hover {
        g {
            stroke: ${({ theme }) => theme.chevronBack.hover};
        }
    }
`;

export const ChevronBack: React.FC<React.ComponentProps<typeof ChevronBackWrapper>> = (props) => (
    <ChevronBackWrapper {...props}>
        <ChevronLeft />
    </ChevronBackWrapper>
);
