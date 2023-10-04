import { useContext, useMemo } from 'react';
import styled from 'styled-components';

import { Button } from 'checkout/components';
import { Link } from 'checkout/components/ui/link';
import { FormName, ModalForms, ModalName, PaymentStatus } from 'checkout/hooks';
import { findNamed } from 'checkout/utils';

import { InitialContext } from '../../../../initial-context';
import { ModalContext } from '../../../modal-context';

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

export const ActionBlock = () => {
    const { locale, initConfig } = useContext(InitialContext);
    const { modalState, forgetPaymentAttempt } = useContext(ModalContext);

    const { hasMultiMethods } = useMemo(() => {
        const info = (findNamed(modalState, ModalName.modalForms) as ModalForms).formsInfo;
        return {
            startedInfo: info.find((item) => item.paymentStatus === PaymentStatus.started),
            hasMultiMethods: !!findNamed(info, FormName.paymentMethods),
        };
    }, [modalState]);

    return (
        <ErrorBlock>
            {!initConfig.isExternalIDIncluded && (
                <>
                    <Button color="primary" onClick={() => location.reload()}>
                        {locale['form.button.reload']}
                    </Button>
                    {hasMultiMethods && (
                        <OthersButton onClick={() => forgetPaymentAttempt()}>
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
