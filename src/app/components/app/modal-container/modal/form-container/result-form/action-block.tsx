import * as React from 'react';
import { useContext } from 'react';

import { Button } from 'checkout/components';
import { Locale } from 'checkout/locale';
import { forgetPaymentAttempt, prepareToRetry } from 'checkout/actions';
import { FormInfo, FormName, ModalForms, ModalName, PaymentStatus } from 'checkout/state';
import { findNamed } from 'checkout/utils';
import { Link } from 'checkout/components/ui/link';
import styled from 'checkout/styled-components';

import { InitialContext } from '../../../../initial-context';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';

const OthersButton = styled(Link)`
    padding-top: 12px;
`;

const ErrorBlock = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;
    align-items: center;

    & > * {
        margin-top: 10px;

        &:first-child {
            margin-top: 0;
        }
    }
`;

const toReenterButtonText = (startedInfo: FormInfo, locale: Locale): string => {
    switch (startedInfo.name) {
        case FormName.cardForm:
            return locale['form.button.use.other.card.label'];
        case FormName.walletForm:
            return locale['form.button.use.other.wallet.label'];
        default:
            return locale['form.button.use.other.default.label'];
    }
};

const payOtherCapability = (startedInfo: FormInfo): boolean =>
    startedInfo && startedInfo.name !== FormName.paymentMethods;

const retryCapability = (startedInfo: FormInfo): boolean =>
    startedInfo && startedInfo.name !== FormName.paymentMethods && startedInfo.name !== FormName.walletProviders;

export const ActionBlock = () => {
    const { locale, initConfig } = useContext(InitialContext);
    const { startedInfo, hasMultiMethods } = useAppSelector((s) => {
        const info = (findNamed(s.modals, ModalName.modalForms) as ModalForms).formsInfo;
        return {
            startedInfo: info.find((item) => item.paymentStatus === PaymentStatus.started),
            hasMultiMethods: !!findNamed(info, FormName.paymentMethods)
        };
    });
    const dispatch = useAppDispatch();

    const retry = (resetFormData: boolean) => {
        dispatch(prepareToRetry(resetFormData));
    };

    return (
        <ErrorBlock>
            {!initConfig.isExternalIDIncluded && (
                <>
                    {retryCapability(startedInfo) && (
                        <Button color="primary" onClick={() => retry(false)} id="retry-btn">
                            {locale['form.button.pay.again.label']}
                        </Button>
                    )}
                    {payOtherCapability(startedInfo) && (
                        <Button onClick={() => retry(true)} id="reenter-btn">
                            {toReenterButtonText(startedInfo, locale)}
                        </Button>
                    )}
                    {hasMultiMethods && (
                        <OthersButton onClick={() => dispatch(forgetPaymentAttempt())}>
                            {locale['form.payment.method.name.others.label']}
                        </OthersButton>
                    )}
                </>
            )}
            {initConfig.redirectUrl && (
                <OthersButton onClick={() => window.open(initConfig.redirectUrl, '_self')}>
                    {locale['form.button.back.to.website']}
                </OthersButton>
            )}
        </ErrorBlock>
    );
};
