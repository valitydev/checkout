import * as React from 'react';
import styled from 'styled-components';

import { Locale } from 'checkout/locale';

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
    color: ${({ theme }) => theme.externalLink};
`;

const SignUpContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px 0 0 0;
`;

export const SignUp: React.FC<{ locale: Locale; link: string }> = ({ locale, link }) => (
    <SignUpContainer>
        <SignUpText>{locale['digital.wallet.providers']['sign.up']['description']}</SignUpText>
        <SignUpText>
            <SignUpLink href={link} target="_blank">
                {locale['digital.wallet.providers']['sign.up']['link']}
            </SignUpLink>
        </SignUpText>
    </SignUpContainer>
);
