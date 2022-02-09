import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { State } from 'checkout/state';
import { Locale } from 'checkout/locale';
import { Header } from '../header';

export interface WalletProvidersProps {
    locale: Locale;
}

const mapStateToProps = (s: State): Partial<WalletProvidersProps> => ({
    locale: s.config.locale
});

const mapDispatchToProps = (dispatch: Dispatch): Partial<WalletProvidersProps> => ({});

class WalletProvidersDef extends React.Component<WalletProvidersProps> {
    private formRef = React.createRef<HTMLFormElement>();

    render() {
        const { locale } = this.props;
        return (
            <form ref={this.formRef}>
                <div>
                    <Header title={locale['form.header.payment.methods.label']} />
                    Providers list
                </div>
            </form>
        );
    }
}

export const WalletProviders = connect(mapStateToProps, mapDispatchToProps)(WalletProvidersDef);
