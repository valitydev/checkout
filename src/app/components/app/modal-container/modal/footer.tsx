import * as React from 'react';
import { useContext } from 'react';
import { ReactSVG } from 'react-svg';
import styled from 'styled-components';

import { InitialContext } from '../../initial-context';

const FooterWrapper = styled.footer`
    padding: 16px 4px;
    display: flex;
    flex-direction: row-reverse;
`;

export const Footer: React.FC = () => {
    const { initConfig, appConfig } = useContext(InitialContext);
    const initConfigBrandless = initConfig.brandless;
    const appConfigBrandless = appConfig.brandless;
    if (appConfigBrandless && initConfigBrandless) {
        return <></>;
    }
    return (
        <FooterWrapper>
            <ReactSVG src="/assets/logo.svg" />
        </FooterWrapper>
    );
};
