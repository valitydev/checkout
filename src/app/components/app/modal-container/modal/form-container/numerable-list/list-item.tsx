import * as React from 'react';
import styled from 'styled-components';

const Item = styled.li`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    position: relative;
    margin-bottom: 20px;
    font-size: 16px;
    color: ${({ theme }) => theme.font.primaryColor};
    letter-spacing: 0;
    line-height: 20px;

    &:last-child {
        margin-bottom: 0;
    }
`;

const Num = styled.div`
    display: inline-block;
    margin-right: 15px;
    color: ${({ theme }) => theme.font.primaryColor};
`;

const Text = styled.div`
    display: inline-block;
`;

interface ListItemProps {
    number: number;
}

export const ListItem: React.FC<ListItemProps> = (props) => (
    <Item>
        <Num>{props.number}</Num>
        <Text>{props.children}</Text>
    </Item>
);
