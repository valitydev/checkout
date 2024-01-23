import { motion } from 'framer-motion';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { PaymentModelContext } from '../../../common/contexts';
import { device } from '../../../common/utils';
import { FormLoader } from '../../legacy';
import { PaymentFormView } from '../PaymentFormView';
import { PaymentPayload, SlideAnimationDirection } from '../types';
import { useViewModel } from '../useViewModel';
import { ViewModelContext } from '../ViewModelContext';

const Wrapper = styled.div`
    padding: 16px;

    @media ${device.desktop} {
        width: 360px;
        padding: 0;
    }
`;

const Layout = styled.div<{ height?: number }>`
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

const toInitialPos = (slideDirection: SlideAnimationDirection): number => {
    switch (slideDirection) {
        case 'backward':
            return -300;
        case 'forward':
            return 300;
        default:
            return 0;
    }
};

const DEFAULT_HEIGHT_PX = 300;

export function ViewContainerInner() {
    const contentElement = useRef(null);
    const [height, setHeight] = useState(0);

    const { model, startPayment } = useContext(PaymentModelContext);
    const { viewModel, goTo } = useViewModel(model);

    useEffect(() => {
        setHeight(contentElement.current?.clientHeight || DEFAULT_HEIGHT_PX);
    }, []);

    const onSetPaymentPayload = useCallback((payload: PaymentPayload) => {
        startPayment(payload);
    }, []);

    const activeViewName = viewModel.activeView.name;

    return (
        <Wrapper>
            <Layout height={height}>
                <motion.div
                    key={activeViewName}
                    ref={contentElement}
                    animate={{ x: 0 }}
                    initial={{ x: toInitialPos(viewModel.direction) }}
                    transition={{ duration: 0.3 }}
                >
                    <ViewModelContext.Provider value={{ viewModel, goTo, onSetPaymentPayload }}>
                        {activeViewName === 'paymentFormView' && <PaymentFormView />}
                        {activeViewName === 'paymentMethodSelectorView' && <>paymentMethodSelectorView</>}
                        {activeViewName === 'paymentResultView' && <>paymentResultView</>}
                        {activeViewName === 'qrCodeView' && <>qrCodeView</>}
                    </ViewModelContext.Provider>
                    {viewModel.isLoading && <FormLoader />}
                </motion.div>
            </Layout>
        </Wrapper>
    );
}
