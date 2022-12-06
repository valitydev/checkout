import * as React from 'react';
import { ReactSVG } from 'react-svg';

import styled from 'checkout/styled-components';
import { useAppSelector } from 'checkout/configure-store';
import { getAppConfigSelector, getInitConfigSelector } from 'checkout/selectors';

const FooterWrapper = styled.footer`
    padding: 16px 4px;
    display: flex;
    flex-direction: row-reverse;
`;

export const Footer: React.FC = () => {
    const initConfigBrandless = useAppSelector(getInitConfigSelector).brandless;
    const appConfigBrandless = useAppSelector(getAppConfigSelector).brandless;
    if (appConfigBrandless && initConfigBrandless) {
        return <></>;
    }
    return (
        <FooterWrapper>
            <ReactSVG src="/assets/logo.svg" />
        </FooterWrapper>
    );
};
