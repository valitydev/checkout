import styled from 'styled-components';

export const RoundIcon = styled.div<{ color: string }>`
    height: 48px;
    width: 48px;
    min-width: 48px;
    background-color: ${({ color }) => color};
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;
