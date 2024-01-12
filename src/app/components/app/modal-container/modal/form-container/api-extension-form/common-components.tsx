import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

export const Row = styled.div<{ $gap?: number }>`
    display: flex;
    justify-content: space-between;
    gap: ${({ $gap }) => `${$gap}px` || 0};
`;

export const Label = styled.p`
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    margin: 0;
`;

export const Value = styled.p`
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    margin: 0;
    text-align: end;
`;

export const Info = styled.p`
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    margin: 0;
`;
