import * as React from 'react';
import { ReactSVG } from 'react-svg';
import styled from 'styled-components';
import { KnownDigitalWalletProviders } from 'checkout/state';
import { assertUnreachable } from 'checkout/utils';

export const Logo: React.FC<{ provider: KnownDigitalWalletProviders }> = ({ provider }) => {
    switch (provider) {
        case KnownDigitalWalletProviders.Sticpay:
            return <ReactSVG src="/assets/wallet-providers/logos/sticpay.svg" />;
        default:
            assertUnreachable(provider);
    }
};

export const Container = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    height: 48px;
`;

export const WalletProviderLogo: React.FC<{ provider: KnownDigitalWalletProviders }> = (props) => (
    <Container>
        <Logo provider={props.provider} />
    </Container>
);
