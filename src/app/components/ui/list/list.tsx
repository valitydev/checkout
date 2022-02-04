// @ts-ignore
import * as React from 'react';
import styled from 'checkout/styled-components';
import { StyledItem } from './item';

export const List = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 551px;
    overflow-y: auto;
    margin-top: 20px;

    & > ${StyledItem} {
        margin-top: 10px;
        &:first-child {
            margin-top: 0;
        }
    }
`;
