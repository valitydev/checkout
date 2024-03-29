import { useContext } from 'react';
import styled from 'styled-components';

import { ApiExtensionView } from './ApiExtensionView';
import { NoAvailablePaymentMethodsView } from './NoAvailablePaymentMethodsView';
import { PaymentFormView } from './PaymentFormView';
import { PaymentMethodSelectorView } from './PaymentMethodSelectorView';
import { PaymentProcessFailedView } from './PaymentProcessFailedView';
import { PaymentResultView } from './PaymentResultView';
import { QrCodeView } from './QrCodeView';
import { TerminalSelectorView } from './TerminalSelectorView';
import { ViewModelContext } from '../../common/contexts';
import { device } from '../../common/utils';
import { FormLoader } from '../legacy';

const Wrapper = styled.div`
    padding: 16px;

    @media ${device.desktop} {
        width: 420px;
        padding: 0;
    }
`;

const Layout = styled.div`
    position: relative;
    background: #fff;
    border-radius: 16px;
    border: 1px solid ${({ theme }) => theme.form.border};
    padding: 16px;
    @media ${device.desktop} {
        padding: 24px;
    }
    overflow: hidden;
`;

export function ViewContainerInner() {
    const {
        viewModel: { views, activeViewId, isLoading },
    } = useContext(ViewModelContext);

    const activeView = views.get(activeViewId).name;

    return (
        <Wrapper>
            <Layout>
                {activeView === 'NoAvailablePaymentMethodsView' && <NoAvailablePaymentMethodsView />}
                {activeView === 'PaymentMethodSelectorView' && <PaymentMethodSelectorView />}
                {activeView === 'TerminalSelectorView' && <TerminalSelectorView />}
                {activeView === 'PaymentFormView' && <PaymentFormView />}
                {activeView === 'PaymentResultView' && <PaymentResultView />}
                {activeView === 'QrCodeView' && <QrCodeView />}
                {activeView === 'ApiExtensionView' && <ApiExtensionView />}
                {activeView === 'PaymentProcessFailedView' && <PaymentProcessFailedView />}
                {isLoading && <FormLoader />}
            </Layout>
        </Wrapper>
    );
}
