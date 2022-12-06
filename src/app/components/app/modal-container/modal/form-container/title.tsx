import styled from 'checkout/styled-components';
import { device } from 'checkout/utils/device';

export const Title = styled.div`
    font-weight: 500;
    font-size: 16px;
    color: ${({ theme }) => theme.font.primaryColor};
    letter-spacing: 0;
    line-height: 20px;
    width: 100%;

    @media ${device.desktop} {
        text-align: center;
    }
`;
