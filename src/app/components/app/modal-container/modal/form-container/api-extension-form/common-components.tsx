import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
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
    font-size: 14px;
    line-height: 18px;
    margin: 0;
`;

export const Alert = styled.div`
    font-weight: 400;
    font-size: 14px;
    background-color: ${({ theme }) => theme.alert.background};
    padding: 12px;
    border-radius: 8px;

    ul {
        margin: 0;
        padding: 0 0 0 16px;

        li {
            line-height: 18px;
            margin: 0 0 8px 0;
        }
    }

    p {
        margin: 0;
        line-height: 18px;
    }
`;
