import * as React from 'react';
import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import { CardForm } from './card-form';
import { FormName, ModalForms, ModalName, SlideDirection, FormInfo } from 'checkout/hooks';
import { PaymentMethods } from './payment-methods';
import { FormLoader } from './form-loader';
import { ResultForm } from './result-form';
import { WalletForm } from './wallet-form';
import { findNamed } from 'checkout/utils';
import styled from 'checkout/styled-components';
import { device } from 'checkout/utils/device';
import { NoAvailablePaymentMethodForm } from './no-available-payment-method-form';
import { WalletProviders } from './wallet-providers';
import { RedirectForm } from './redirect-form';
import { PaymentTerminalForm } from './payment-terminal-form';
import { QrCodeInteractionForm } from './qr-code-interaction-form';
import { PaymentTerminalSelectorForm } from './payment-terminal-selector-form';
import isNil from 'checkout/utils/is-nil';

import { ModalContext } from '../../modal-context';

const Container = styled.div`
    padding: 16px;

    @media ${device.desktop} {
        width: 360px;
        padding: 0;
    }
`;

const Form = styled.div<{ height?: number }>`
    background: #fff;
    border-radius: 16px;
    border: 1px solid ${({ theme }) => theme.form.border};
    padding: 24px;
    position: relative;
    overflow: hidden;
    transition: height 0.3s;
    height: ${({ height }) => (height ? `${height}px` : 'auto')};
`;

const renderForm = ({ name }: FormInfo, onMount: () => void) => {
    switch (name) {
        case FormName.paymentMethods:
            return <PaymentMethods onMount={onMount} />;
        case FormName.cardForm:
            return <CardForm onMount={onMount} />;
        case FormName.walletForm:
            return <WalletForm onMount={onMount} />;
        case FormName.walletProviders:
            return <WalletProviders onMount={onMount} />;
        case FormName.resultForm:
            return <ResultForm onMount={onMount} />;
        case FormName.noAvailablePaymentMethodForm:
            return <NoAvailablePaymentMethodForm onMount={onMount} />;
        case FormName.redirectForm:
            return <RedirectForm onMount={onMount} />;
        case FormName.paymentTerminalForm:
            return <PaymentTerminalForm onMount={onMount} />;
        case FormName.paymentTerminalSelector:
            return <PaymentTerminalSelectorForm onMount={onMount} />;
        case FormName.qrCodeInteractionForm:
            return <QrCodeInteractionForm onMount={onMount} />;
        default:
            return null;
    }
};

export const FormContainer = () => {
    const contentElement = useRef(null);
    const [height, setHeight] = useState(0);
    const { modalState } = useContext(ModalContext);

    const { activeFormInfo, viewInfo } = useMemo(() => {
        const modalForms = findNamed(modalState, ModalName.modalForms) as ModalForms;
        return {
            activeFormInfo: modalForms.formsInfo.find((item) => item.active),
            viewInfo: modalForms.viewInfo
        };
    }, [modalState]);

    const onMount = useCallback(() => {
        const elHight = contentElement.current?.clientHeight || 0;
        if (elHight !== height) {
            setHeight(elHight);
        }
    }, [contentElement, height, setHeight]);

    return (
        <Container>
            <Form height={height}>
                {!isNil(activeFormInfo) && (
                    <motion.div
                        ref={contentElement}
                        key={activeFormInfo.name}
                        initial={{ x: viewInfo.slideDirection === SlideDirection.left ? -300 : 300 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.3 }}>
                        {renderForm(activeFormInfo, onMount)}
                        {viewInfo.inProcess && <FormLoader />}
                    </motion.div>
                )}
            </Form>
        </Container>
    );
};
