import { useContext } from 'react';
import styled from 'styled-components';

import { LocaleContext } from '../../common/contexts';

const Container = styled.div`
    padding: 80px 0;
`;

const Text = styled.p<{ centered?: boolean }>`
    font-weight: 500;
    margin-top: 0;
    margin-bottom: 30px;
    line-height: 20px;
    text-align: ${(props) => (props.centered ? 'center' : undefined)};
`;

export function NoAvailablePaymentMethodsView() {
    const { l } = useContext(LocaleContext);

    return (
        <Container>
            <Text centered={true} color="bodyText">
                {l['info.modal.no.available.payment.method']}
            </Text>
        </Container>
    );
}
