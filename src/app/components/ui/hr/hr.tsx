import styled from 'checkout/styled-components';

export const Hr = styled.hr`
    width: 100%;
    border: 0;
    border-top: 1px solid ${({ theme }) => theme.color.neutral[0.1]};
`;
