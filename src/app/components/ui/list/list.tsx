// @ts-ignore
import * as React from 'react';
import styled from 'styled-components';
import { StyledItem } from './item';

export const List = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    & > ${StyledItem} {
        margin-top: 10px;
        &:first-child {
            margin-top: 0;
        }
    }
`;
