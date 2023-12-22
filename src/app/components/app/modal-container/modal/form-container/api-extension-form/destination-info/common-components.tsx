import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const Row = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const Label = styled.p`
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    margin: 0;
`;

export const Value = styled.p`
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    margin: 0;
`;
