import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { FormInfo, FormName, PaymentMethod, PaymentMethodName, State, WalletFormInfo } from 'checkout/state';
import { Locale } from 'checkout/locale';
import { Header } from '../header';
import SticpayIcon from './sticpay.svg';
import styled from 'styled-components';
import { goToFormInfo } from 'checkout/actions';

const MethodContainer = styled.li`
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.neutral[0.2]};
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    height: 80px;
    margin-bottom: 10px;
`;

export interface SticpayPaymentMethodItemProps {
    previous: FormName;
    setFormInfo: (formInfo: FormInfo) => any;
}

const toWalletProvider = (props: SticpayPaymentMethodItemProps) =>
    props.setFormInfo(new WalletFormInfo(props.previous));

const SticpayPaymentMethodItem: React.FC<SticpayPaymentMethodItemProps> = (props) => (
    <MethodContainer onClick={toWalletProvider.bind(null, props)} id="sticpay-payment-method">
        <SticpayIcon />
    </MethodContainer>
);

export interface WalletProvidersProps {
    locale: Locale;
    setFormInfo: (formInfo: FormInfo) => any;
    methods: PaymentMethod[];
}

const mapStateToProps = (s: State): Partial<WalletProvidersProps> => ({
    locale: s.config.locale,
    methods: s.availablePaymentMethods.find((m) => m.name === PaymentMethodName.DigitalWallet).subMethods
});

const mapDispatchToProps = (dispatch: Dispatch): Partial<WalletProvidersProps> => ({
    setFormInfo: bindActionCreators(goToFormInfo, dispatch)
});

class WalletProvidersDef extends React.Component<WalletProvidersProps> {
    private formRef = React.createRef<HTMLFormElement>();

    render() {
        const { locale, methods } = this.props;
        return (
            <form ref={this.formRef}>
                <div>
                    <Header title={locale['form.header.payment.methods.label']} />
                    {methods.map((method) => {
                        switch (method.name) {
                            case PaymentMethodName.Sticpay:
                                return (
                                    <SticpayPaymentMethodItem
                                        key={method.name}
                                        previous={FormName.walletProviders}
                                        setFormInfo={this.props.setFormInfo}
                                    />
                                );
                        }
                    })}
                </div>
            </form>
        );
    }
}

export const WalletProviders = connect(mapStateToProps, mapDispatchToProps)(WalletProvidersDef);
