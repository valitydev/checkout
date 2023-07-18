import styled from 'styled-components';

export const Divider = styled.div`
    height: 1px;
    background-color: ${({ theme }) => theme.divider};
    margin: 30px auto;
    width: 40%;
`;
