import styled from 'styled-components';

import { PaymentMethod } from 'checkout/hooks';

import { Methods } from './methods';

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
