import * as React from 'react';

import { Methods } from './methods';
import styled from 'checkout/styled-components';
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
