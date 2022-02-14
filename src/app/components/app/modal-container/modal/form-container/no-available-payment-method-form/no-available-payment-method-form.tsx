import * as React from 'react';
import { connect } from 'react-redux';

import styled from 'checkout/styled-components';
import { State } from 'checkout/state';
import { Locale } from 'checkout/locale';
import { Text } from '../text';

const mapStateToProps = (s: State) => ({
    locale: s.config.locale
});

export interface NoAvailablePaymentMethodFormProps {
    locale: Locale;
}

const Container = styled.div`
    padding: 80px 0;
`;

class NoAvailablePaymentMethodFormDef extends React.Component<NoAvailablePaymentMethodFormProps> {
    render() {
        const { locale } = this.props;
        return (
            <Container>
                <Text centered={true}>{locale['info.modal.no.available.payment.method']}</Text>
            </Container>
        );
    }
}

export const NoAvailablePaymentMethodForm = connect(mapStateToProps)(NoAvailablePaymentMethodFormDef);
