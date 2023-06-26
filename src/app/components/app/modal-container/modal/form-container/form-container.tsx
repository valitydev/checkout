import * as React from 'react';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { CardForm } from './card-form';
import { FormName, ModalForms, ModalName, SlideDirection, FormInfo } from 'checkout/hooks';
import { PaymentMethods } from './payment-methods';
import { FormLoader } from './form-loader';
import { ResultForm } from './result-form';
import { WalletForm } from './wallet-form';
import { findNamed } from 'checkout/utils';
import styled, { css } from 'checkout/styled-components';
import { device } from 'checkout/utils/device';
import { shake } from 'checkout/styled-components/animations';
import { stylableTransition, ENTER, LEAVE, ACTIVE } from 'checkout/styled-transition';
import { NoAvailablePaymentMethodForm } from './no-available-payment-method-form';
import { WalletProviders } from './wallet-providers';
import { RedirectForm } from './redirect-form';
import { PaymentTerminalForm } from './payment-terminal-form';
import { QrCodeInteractionForm } from './qr-code-interaction-form';
import { PaymentTerminalSelectorForm } from './payment-terminal-selector-form';
import { ModalContext } from '../../modal-context';
import isNil from 'checkout/utils/is-nil';

const Container = styled.div`
    padding: 0 8px 32px 8px;

    @media ${device.desktop} {
        width: 360px;
        padding: 0;
    }
`;

const Form = styled.div<{ error?: any; height?: number }>`
    background: #fff;
    border-radius: 16px;
    border: 1px solid ${({ theme }) => theme.form.border};
    padding: 30px 20px;
    position: relative;
    overflow: hidden;
    transition: height 0.1s;
    height: ${({ height }) => (height ? `${height}px` : 'auto')};

    @media ${device.desktop} {
        padding: 30px;
        min-height: auto;
    }

    ${({ error }) =>
        error &&
        css`
            animation: ${shake} 0.82s;
        `}
`;

const slideTransitionTime = '0.3s';

const slideLeftAnimation = css`
    ${ENTER} {
        transform: translateX(-100%);
        opacity: 0;
        transition: all ${slideTransitionTime};

        ${ACTIVE} {
            transform: translateX(0);
            opacity: 1;
        }
    }

    ${LEAVE} {
        transform: translateX(0);
        opacity: 1;
        position: absolute;
        top: 0;
        transition: all ${slideTransitionTime};
        width: 100%;

        ${ACTIVE} {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;

const slideRightAnimation = css`
    ${ENTER} {
        transform: translateX(100%);
        opacity: 0;
        transition: all ${slideTransitionTime};

        ${ACTIVE} {
            transform: translateX(0);
            opacity: 1;
        }
    }

    ${LEAVE} {
        transform: translateX(0);
        opacity: 1;
        position: absolute;
        top: 0;
        transition: all ${slideTransitionTime};
        width: 100%;

        ${ACTIVE} {
            transform: translateX(-100%);
            opacity: 0;
        }
    }
`;

const FormContainerAnimation = styled(stylableTransition)<{ direction: SlideDirection }>`
    height: 100%;
    position: relative;

    form {
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        flex-direction: column;
        justify-content: space-between;
    }

    ${ENTER},${LEAVE} {
        * {
            pointer-events: none !important;
        }
    }

    ${({ direction }) => (direction === SlideDirection.left ? slideLeftAnimation : slideRightAnimation)}
`;

const renderForm = ({ name }: FormInfo) => {
    switch (name) {
        case FormName.paymentMethods:
            return <PaymentMethods key={name} />;
        case FormName.cardForm:
            return <CardForm key={name} />;
        case FormName.walletForm:
            return <WalletForm key={name} />;
        case FormName.walletProviders:
            return <WalletProviders key={name} />;
        case FormName.resultForm:
            return <ResultForm key={name} />;
        case FormName.noAvailablePaymentMethodForm:
            return <NoAvailablePaymentMethodForm key={name} />;
        case FormName.redirectForm:
            return <RedirectForm key={name} />;
        case FormName.paymentTerminalForm:
            return <PaymentTerminalForm key={name} />;
        case FormName.paymentTerminalSelector:
            return <PaymentTerminalSelectorForm key={name} />;
        case FormName.qrCodeInteractionForm:
            return <QrCodeInteractionForm key={name} />;
        default:
            return null;
    }
};

const DEFAULT_HEIGHT_PX = 300;

export const FormContainer = () => {
    const contentElement = useRef(null);
    const [height, setHeight] = useState(0);
    const { modalState } = useContext(ModalContext);

    useEffect(() => {
        setHeight(contentElement.current?.clientHeight || DEFAULT_HEIGHT_PX);
    }, []);

    const { activeFormInfo, viewInfo } = useMemo(() => {
        const modalForms = findNamed(modalState, ModalName.modalForms) as ModalForms;
        return {
            activeFormInfo: modalForms.formsInfo.find((item) => item.active),
            viewInfo: modalForms.viewInfo
        };
    }, [modalState]);

    const onTransitionEnd = useCallback(() => {
        const elHight = contentElement.current?.clientHeight || 0;
        if (elHight !== height) {
            setHeight(elHight);
        }
    }, [contentElement, height, setHeight]);

    return (
        <Container>
            <Form error={viewInfo.error} height={height}>
                <div ref={contentElement}>
                    <FormContainerAnimation
                        component="div"
                        direction={viewInfo.slideDirection}
                        enter={300}
                        leave={300}
                        onTransitionEnd={onTransitionEnd}>
                        {!isNil(activeFormInfo) && renderForm(activeFormInfo)}
                    </FormContainerAnimation>
                    {viewInfo.inProcess && <FormLoader />}
                </div>
            </Form>
        </Container>
    );
};
