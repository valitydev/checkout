import { motion } from 'framer-motion';
import * as React from 'react';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import { FormName, ModalForms, ModalName, SlideDirection } from 'checkout/hooks';
import { findNamed } from 'checkout/utils';
import { device } from 'checkout/utils/device';

import { CardForm } from './card-form';
import { FormLoader } from './form-loader';
import { NoAvailablePaymentMethodForm } from './no-available-payment-method-form';
import { PaymentMethods } from './payment-methods';
import { PaymentTerminalForm } from './payment-terminal-form';
import { PaymentTerminalSelectorForm } from './payment-terminal-selector-form';
import { QrCodeInteractionForm } from './qr-code-interaction-form';
import { RedirectForm } from './redirect-form';
import { ResultForm } from './result-form';
import { WalletForm } from './wallet-form';
import { WalletProviders } from './wallet-providers';
import { ModalContext } from '../../modal-context';

const Container = styled.div`
    padding: 16px;

    @media ${device.desktop} {
        width: 360px;
        padding: 0;
    }
`;

const Form = styled.div<{ height?: number }>`
    position: relative;
    background: #fff;
    border-radius: 16px;
    border: 1px solid ${({ theme }) => theme.form.border};
    padding: 24px;
    overflow: hidden;
    transition: height 0.3s;
    height: ${({ height }) => (height ? `${height}px` : 'auto')};
`;

const renderForm = (name: FormName, onMount: () => void) => {
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

const toInitialPos = (slideDirection: SlideDirection): number => {
    switch (slideDirection) {
        case SlideDirection.left:
            return -300;
        case SlideDirection.right:
            return 300;
        default:
            return 0;
    }
};

const DEFAULT_HEIGHT_PX = 300;

export const FormContainer = () => {
    const contentElement = useRef(null);
    const [height, setHeight] = useState(0);
    const { modalState } = useContext(ModalContext);

    const {
        formName,
        viewInfo: { slideDirection, inProcess },
    } = useMemo(() => {
        const found = findNamed(modalState, ModalName.modalForms) as ModalForms;
        return {
            formName: found.formsInfo.find((item) => item.active)?.name,
            viewInfo: found.viewInfo,
        };
    }, [modalState]);

    const onMount = useCallback(() => {
        const elHight = contentElement.current?.clientHeight || 0;
        if (elHight !== height) {
            setHeight(elHight);
        }
    }, [contentElement, height, setHeight]);

    useEffect(() => {
        setHeight(contentElement.current?.clientHeight || DEFAULT_HEIGHT_PX);
    }, []);

    return (
        <Container>
            <Form height={height}>
                <motion.div
                    key={formName}
                    ref={contentElement}
                    animate={{ x: 0 }}
                    initial={{ x: toInitialPos(slideDirection) }}
                    transition={{ duration: 0.3 }}
                >
                    {renderForm(formName, onMount)}
                    {inProcess && <FormLoader />}
                </motion.div>
            </Form>
        </Container>
    );
};
