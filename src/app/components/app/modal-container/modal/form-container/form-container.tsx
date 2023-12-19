import { motion } from 'framer-motion';
import { lazy, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import styled from 'styled-components';

import { ErrorBoundaryFallback } from 'checkout/components/ui';
import { FormName, ModalForms, ModalName, SlideDirection } from 'checkout/hooks';
import { findNamed } from 'checkout/utils';
import { device } from 'checkout/utils/device';

import { FormLoader } from './form-loader';
import NoAvailablePaymentMethodForm from './no-available-payment-method-form/no-available-payment-method-form';
import RedirectForm from './redirect-form/redirect-form';
import ResultForm from './result-form/result-form';
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
    padding: 16px;
    @media ${device.desktop} {
        padding: 24px;
    }
    overflow: hidden;
    transition: height 0.3s;
    height: ${({ height }) => (height ? `${height}px` : 'auto')};
`;

const PaymentMethods = lazy(() => import('./payment-methods/payment-methods'));

const CardForm = lazy(() => import('./card-form/card-form'));

const WalletForm = lazy(() => import('./wallet-form/wallet-form'));

const WalletProviders = lazy(() => import('./wallet-providers/wallet-providers'));

const PaymentTerminalForm = lazy(() => import('./payment-terminal-form/payment-terminal-form'));

const PaymentTerminalSelectorForm = lazy(
    () => import('./payment-terminal-selector-form/payment-terminal-selector-form'),
);

const QrCodeInteractionForm = lazy(() => import('./qr-code-interaction-form/qr-code-interaction-form'));

const ApiExtensionForm = lazy(() => import('./api-extension-form/api-extension-form'));

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
        case FormName.apiExtensionForm:
            return <ApiExtensionForm onMount={onMount} />;
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
                    <ErrorBoundary fallback={<ErrorBoundaryFallback />}>{renderForm(formName, onMount)}</ErrorBoundary>
                    {inProcess && <FormLoader />}
                </motion.div>
            </Form>
        </Container>
    );
};
