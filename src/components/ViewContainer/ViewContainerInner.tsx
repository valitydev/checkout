import { motion } from 'framer-motion';
import { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { PaymentFormView } from './PaymentFormView';
import { PaymentResultView } from './PaymentResultView';
import { QrCodeView } from './QrCodeView';
import { SlideAnimationDirection } from './types';
import { ViewModelContext } from '../../common/contexts';
import { device, isNil } from '../../common/utils';
import { FormLoader } from '../legacy';

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
        case 'none':
            return 0;
    }
};

const DEFAULT_HEIGHT_PX = 300;

export function ViewContainerInner() {
    const contentElement = useRef(null);
    const [height, setHeight] = useState(0);
    const { viewModel } = useContext(ViewModelContext);

    const activeView = viewModel?.activeView;

    useEffect(() => {
        setHeight(contentElement.current?.clientHeight || DEFAULT_HEIGHT_PX);
    }, [activeView]);

    return (
        <Wrapper>
            <Layout height={height}>
                {!isNil(activeView) && (
                    <motion.div
                        key={activeView}
                        ref={contentElement}
                        animate={{ x: 0 }}
                        initial={{ x: toInitialPos(viewModel.direction) }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeView === 'PaymentFormView' && <PaymentFormView />}
                        {activeView === 'PaymentMethodSelectorView' && <>PaymentMethodSelectorView</>}
                        {activeView === 'PaymentResultView' && <PaymentResultView />}
                        {activeView === 'QrCodeView' && <QrCodeView />}
                        {viewModel.isLoading && <FormLoader />}
                    </motion.div>
                )}
                {isNil(activeView) && <p>Active view name is null</p>}
            </Layout>
        </Wrapper>
    );
}
