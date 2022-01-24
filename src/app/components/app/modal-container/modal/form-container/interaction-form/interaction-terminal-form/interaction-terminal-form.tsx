import * as React from 'react';
import { connect } from 'react-redux';

import { State } from 'checkout/state';
import { Header } from '../../header';
import { formatInvoiceAmount, FormattedAmount } from 'checkout/utils';
import { PaymentTerminalReceipt } from 'checkout/backend';
import { Locale } from 'checkout/locale';
import { ReceiptInfo } from './receipt-info';
import { EurosetLogo } from 'checkout/components';
import styled from 'checkout/styled-components';
import { Config } from 'checkout/config';

const Container = styled.div`
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;
    align-content: center;
    width: 100%;
`;

const SystemLogo = styled(EurosetLogo)`
    max-height: 50px;
    max-width: 105px;
    margin-bottom: 25px;
`;

const mapStateToProps = (s: State) => ({
    locale: s.config.locale,
    amount: formatInvoiceAmount(s.model.invoice),
    config: s.config
});

export interface InteractionTerminalFormProps {
    receipt: PaymentTerminalReceipt;
    locale: Locale;
    amount: FormattedAmount;
    config: Config;
}

class InteractionTerminalFormDef extends React.Component<InteractionTerminalFormProps> {
    render() {
        const { locale, receipt, amount, config } = this.props;
        return (
            <Container id="terminal-interaction">
                <Header title={this.props.locale['form.header.pay.euroset.label']} />
                <SystemLogo />
                <ReceiptInfo amount={amount} receipt={receipt} locale={locale} config={config} />
            </Container>
        );
    }
}

export const InteractionTerminalForm = connect(mapStateToProps)(InteractionTerminalFormDef);
