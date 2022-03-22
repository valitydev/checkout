import * as React from 'react';
import styled from 'styled-components';
import { Locale } from 'checkout/locale';
import { KnownDigitalWalletProviders } from 'checkout/state';
import { assertUnreachable } from 'checkout/utils';

const SignUpText = styled.p`
    font-weight: 500;
    margin: 0;
    line-height: 24px;
    font-size: 14px;
    text-align: center;
`;

const SignUpLink = styled.a`
    text-decoration: underline;
    cursor: pointer;
    color: ${({ theme }) => theme.color.link};
`;

const SignUpContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px 0 0 0;
`;

// TODO Tiger Pay: https://secure.tiger-pay.com/dashboard/register
const getHref = (provider: KnownDigitalWalletProviders) => {
    switch (provider) {
        case KnownDigitalWalletProviders.Sticpay:
            return 'https://sticpay.com/ja-JP/open_account/customer';
        case KnownDigitalWalletProviders.Venuspoint:
            return 'https://venuspoint.net/check/';
        default:
            assertUnreachable(provider);
    }
};

export const SignUp: React.FC<{ locale: Locale; provider: KnownDigitalWalletProviders }> = ({ locale, provider }) => (
    <SignUpContainer>
        <SignUpText>{locale['digital.wallet.providers']['sign.up']['description']}</SignUpText>
        <SignUpText>
            <SignUpLink href={getHref(provider)} target="_blank">
                {locale['digital.wallet.providers']['sign.up']['link']}
            </SignUpLink>
        </SignUpText>
    </SignUpContainer>
);
