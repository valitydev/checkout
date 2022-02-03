import * as React from 'react';
import { connect } from 'react-redux';
import get from 'lodash-es/get';
import { bindActionCreators, Dispatch } from 'redux';

import { FormName, ModalForms, ModalName, ModalState, State } from 'checkout/state';
import { toFieldsConfig } from '../fields-config';
import { findNamed } from 'checkout/utils';
import { pay, setViewInfoError } from 'checkout/actions';
import { Header } from '../header';
import { BankList } from './banks-list/banks-list';

const toOnlineBankingFormInfo = (m: ModalState[]) =>
    findNamed((findNamed(m, ModalName.modalForms) as ModalForms).formsInfo, FormName.onlineBankingForm);

const mapState = (state: State) => ({
    config: state.config,
    model: state.model,
    formValues: get(state.form, 'onlineBankingForm.values'),
    locale: state.config.locale,
    fieldsConfig: toFieldsConfig(state.config.initConfig, state.model.invoiceTemplate),
    onlineBankingFormInfo: toOnlineBankingFormInfo(state.modals)
});
const mapDispatch = (dispatch: Dispatch) => ({
    setViewInfoError: bindActionCreators(setViewInfoError, dispatch),
    pay: bindActionCreators(pay, dispatch)
});

const OnlineBankingFormDef: React.FC<ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>> = (props) => {
    const banks = [
        { name: 'First bank name' },
        { name: 'Bank NameBank NameBank NameBank NameBank NameBank Name' },
        { name: 'Third bank name' },
        { name: 'Four Bank Name' },
        { name: 'Bank Name' },
        { name: 'Bank Name' },
        { name: 'Bank Name' },
        { name: 'Bank Name' },
        { name: 'Bank Name' },
        { name: 'Bank Name' },
        { name: 'Bank Name' },
        { name: 'Bank Name' },
        { name: 'Bank Name' },
        { name: 'Bank Name' },
        { name: 'Bank Name' },
        { name: 'Bank Name' },
        { name: 'Bank Name' }
    ];

    return (
        <form>
            <div>
                <Header title={props.locale['form.payment.method.name.onlineBanking.label']} />
                <BankList banks={banks} />
            </div>
        </form>
    );
};

export const OnlineBankingForm = connect(mapState, mapDispatch)(OnlineBankingFormDef);
