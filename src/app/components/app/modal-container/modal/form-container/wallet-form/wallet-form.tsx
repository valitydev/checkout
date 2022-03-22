import * as React from 'react';
import { connect } from 'react-redux';
import get from 'lodash-es/get';
import { InjectedFormProps, reduxForm } from 'redux-form';
import { bindActionCreators, Dispatch } from 'redux';

import { WalletFormProps } from './wallet-form-props';
import { FormGroup } from '../form-group';
import {
    FormName,
    KnownDigitalWalletProviders,
    ModalForms,
    ModalName,
    ModalState,
    PaymentMethodName,
    PaymentStatus,
    State,
    WalletFormValues
} from 'checkout/state';
import { PayButton } from '../pay-button';
import { Header } from '../header';
import { Amount } from '../common-fields';
import { toFieldsConfig } from '../fields-config';
import { findNamed } from 'checkout/utils';
import { pay, setViewInfoError } from 'checkout/actions';
import { WalletProviderLogo } from './wallet-provider-logo';
import { WalletProviderFormGroup } from './wallet-provider-form-group';
import { SignUp } from './sign-up';

const toWalletFormInfo = (m: ModalState[]) => {
    const info = (findNamed(m, ModalName.modalForms) as ModalForms).formsInfo;
    return findNamed(info, FormName.walletForm);
};

const mapStateToProps = (state: State) => ({
    config: state.config,
    model: state.model,
    formValues: get(state.form, 'walletForm.values'),
    locale: state.config.locale,
    fieldsConfig: toFieldsConfig(state.config.initConfig, state.model.invoiceTemplate),
    walletFormInfo: toWalletFormInfo(state.modals)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    setViewInfoError: bindActionCreators(setViewInfoError, dispatch),
    pay: bindActionCreators(pay, dispatch)
});

type Props = WalletFormProps & InjectedFormProps;

class WalletFormDef extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
        this.submit = this.submit.bind(this);
    }

    init(values: WalletFormValues, activeProvider: KnownDigitalWalletProviders) {
        this.props.initialize({
            email: values?.email,
            amount: values?.amount,
            provider: activeProvider
        });
    }

    submit(values: WalletFormValues) {
        (document.activeElement as HTMLElement).blur();
        this.props.pay({ method: PaymentMethodName.DigitalWallet, values });
    }

    componentWillMount() {
        const {
            walletFormInfo: { paymentStatus, activeProvider },
            formValues
        } = this.props;
        this.props.setViewInfoError(false);
        switch (paymentStatus) {
            case PaymentStatus.pristine:
                this.init(formValues, activeProvider);
                break;
            case PaymentStatus.needRetry:
                this.submit(formValues);
                break;
        }
    }

    componentWillReceiveProps(props: Props) {
        if (props.submitFailed) {
            props.setViewInfoError(true);
        }
    }

    render() {
        const {
            handleSubmit,
            fieldsConfig: { amount },
            walletFormInfo: { activeProvider },
            locale
        } = this.props;
        return (
            <form onSubmit={handleSubmit(this.submit)} id="wallet-form">
                <div>
                    <Header title={locale['digital.wallet.providers'][activeProvider].name} />
                    <WalletProviderLogo provider={activeProvider} />
                    <WalletProviderFormGroup provider={activeProvider} />
                    {amount.visible && (
                        <FormGroup>
                            <Amount cost={amount.cost} />
                        </FormGroup>
                    )}
                </div>
                <PayButton />
                <SignUp locale={locale} provider={activeProvider} />
            </form>
        );
    }
}

const ReduxForm = reduxForm({
    form: FormName.walletForm,
    destroyOnUnmount: false
})(WalletFormDef);

export const WalletForm = connect(mapStateToProps, mapDispatchToProps)(ReduxForm as any);
