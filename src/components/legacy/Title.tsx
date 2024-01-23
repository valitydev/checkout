import styled from 'styled-components';

export const Title = styled.div`
    font-weight: 500;
    font-size: 16px;
    color: ${({ theme }) => theme.font.primaryColor};
    letter-spacing: 0;
    line-height: 20px;
    width: 100%;
    text-align: center;
`;
