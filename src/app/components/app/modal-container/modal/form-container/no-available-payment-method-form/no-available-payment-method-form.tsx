import * as React from 'react';
import { useContext } from 'react';

import styled from 'checkout/styled-components';
import { Text } from '../text';

import { InitialContext } from '../../../../initial-context';

const Container = styled.div`
    padding: 80px 0;
`;

export const NoAvailablePaymentMethodForm = () => {
    const { locale } = useContext(InitialContext);
    return (
        <Container>
            <Text centered={true}>{locale['info.modal.no.available.payment.method']}</Text>
        </Container>
    );
};
