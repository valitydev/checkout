import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    img {
        height: 40px;
        width: 194px;
    }
`;

export const VenuspointLogo: React.FC = () => (
    <Container>
        <img src="/assets/payment-service-providers/logos/venuspoint.png" />
    </Container>
);
