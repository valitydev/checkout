import * as React from 'react';
import { useContext, useEffect } from 'react';
import styled from 'styled-components';

import { InitialContext } from '../../../../initial-context';
import { Text } from '../text';


const Container = styled.div`
    padding: 80px 0;
`;

export const NoAvailablePaymentMethodForm = ({ onMount }: { onMount: () => void }) => {
    const { locale } = useContext(InitialContext);

    useEffect(() => {
        onMount();
    }, []);

    return (
        <Container>
            <Text centered={true}>{locale['info.modal.no.available.payment.method']}</Text>
        </Container>
    );
};
