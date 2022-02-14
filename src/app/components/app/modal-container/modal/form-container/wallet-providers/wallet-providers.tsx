import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import {
    FormInfo,
    FormName,
    PaymentMethod,
    PaymentMethodName,
    State,
    DigitalWalletPaymentMethod,
    KnownDigitalWalletProviders
} from 'checkout/state';
import { Locale } from 'checkout/locale';
import { Header } from '../header';
import { goToFormInfo } from 'checkout/actions';
import { WalletProviderPaymentMethodItem } from '../wallet-provider-payment-method-item';

export interface WalletProvidersProps {
    locale: Locale;
    setFormInfo: (formInfo: FormInfo) => any;
    providers: KnownDigitalWalletProviders[];
}

const toProviders = (methods: PaymentMethod[]) =>
    (methods.find((m) => m.name === PaymentMethodName.DigitalWallet) as DigitalWalletPaymentMethod).providers;

const mapStateToProps = (s: State): Partial<WalletProvidersProps> => ({
    locale: s.config.locale,
    providers: toProviders(s.availablePaymentMethods)
});

const mapDispatchToProps = (dispatch: Dispatch): Partial<WalletProvidersProps> => ({
    setFormInfo: bindActionCreators(goToFormInfo, dispatch)
});

class WalletProvidersDef extends React.Component<WalletProvidersProps> {
    private formRef = React.createRef<HTMLFormElement>();

    render() {
        const { locale, providers } = this.props;
        return (
            <form ref={this.formRef}>
                <div>
                    <Header title={locale['form.header.payment.methods.label']} />
                    {providers.map((provider) => {
                        <WalletProviderPaymentMethodItem
                            key={provider}
                            previous={FormName.walletProviders}
                            setFormInfo={this.props.setFormInfo}
                            provider={provider}
                        />;
                    })}
                </div>
            </form>
        );
    }
}

export const WalletProviders = connect(mapStateToProps, mapDispatchToProps)(WalletProvidersDef);
