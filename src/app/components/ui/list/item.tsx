import styled from 'styled-components';
import * as React from 'react';
import { ReactNode } from 'react';

export const StyledItem = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
`;
const StyledTitle = styled.div`
    margin-left: 10px;
    font-weight: 500;
    font-size: 16px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

export const Item: React.FC<
    Omit<JSX.IntrinsicElements['div'], 'ref'> & {
        title: ReactNode;
        icon?: ReactNode;
    }
> = ({ icon, title, ...params }) => (
    <StyledItem {...params}>
        {icon}
        <StyledTitle>{title}</StyledTitle>
    </StyledItem>
);
