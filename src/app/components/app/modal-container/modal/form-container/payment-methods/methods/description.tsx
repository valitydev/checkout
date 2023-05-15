import styled from 'checkout/styled-components';

export const Description = styled.p`
    font-weight: 400;
    font-size: 13px;
    color: ${({ theme }) => theme.font.primaryColor};
    letter-spacing: 0.1px;
    line-height: 17px;
    padding: 4px 0 0;
    margin: 0;
`;
