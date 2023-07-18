import styled from 'styled-components';

export const Hr = styled.hr`
    width: 100%;
    border: 0;
    border-top: 1px solid ${({ theme }) => theme.divider};
`;
