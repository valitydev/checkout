import * as React from 'react';
import styled from 'styled-components';

import { Methods } from './methods';
import { PaymentMethod } from 'checkout/hooks';

const List = styled.ul`
    margin: 0;
    padding: 0;
    list-style: none;
    min-height: 266px;
`;

export const MethodsList = ({ methods }: { methods: PaymentMethod[] }) => (
    <List>
        <Methods methods={methods} />
    </List>
);
