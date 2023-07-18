import styled from 'styled-components';

export const Text = styled.p`
    font-weight: 500;
    font-size: 16px;
    color: ${({ theme }) => theme.font.primaryColor};
    letter-spacing: 0;
    line-height: 20px;
    text-align: center;
    margin-bottom: 20px;
`;
