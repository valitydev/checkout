import * as React from 'react';

import { Methods } from './methods';
import styled from 'checkout/styled-components';
import { stylableTransition } from 'checkout/styled-transition';
import { PaymentMethod } from 'checkout/hooks';

const List = styled(stylableTransition)`
    margin: 0;
    padding: 0;
    list-style: none;
    min-height: 266px;
`;

export const MethodsList = ({ methods }: { methods: PaymentMethod[] }) => (
    <List component="ul" appear={1000} leave={1000}>
        <Methods methods={methods} />
    </List>
);
