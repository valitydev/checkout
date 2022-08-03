import * as React from 'react';
import { ReactSVG } from 'react-svg';

import { PaymentMethodName } from 'checkout/state';
import SecureIcon from './secure-icon.svg';
import VisaIcon from './visa-icon.svg';
import McIcon from './mc-icon.svg';
import PciDssIcon from './pci-dss-icon.svg';
import { device } from 'checkout/utils/device';
import styled, { css } from 'checkout/styled-components';
import { useAppSelector } from 'checkout/configure-store';
import { getAppConfigSelector, getAvailablePaymentMethodSelector, getLocaleSelector } from 'checkout/selectors';

const FooterWrapper = styled.footer`
    padding: 30px 25px;
    position: relative;
    @media ${device.desktop} {
        padding: 15px 0;
    }
`;

const SafePaymentContainer = styled.div`
    @media ${device.desktop} {
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
    }
`;

const SafePayment = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
    margin: 0 0 15px;
`;

const StyledSecureIcon = styled(SecureIcon)`
    margin-right: 8px;
    position: relative;
    top: -2px;
`;

const Label = styled.p`
    font-size: 11px;
    font-weight: 900;
    color: #fff;
    letter-spacing: 2px;
    line-height: 15px;
    text-transform: uppercase;
    margin: 0;
`;

const SafeLogos = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 25px;
    flex-grow: 1;
`;

const fixPosition = css`
    position: relative;
    top: 4px;
`;

const iconGap = css`
    margin-right: 16px;
`;

const fillIconWhite = css`
    * {
        fill: #fff;
    }
`;

const StyledVisaIcon = styled(VisaIcon)`
    ${iconGap}
    ${fillIconWhite}
`;

const StyledMcIcon = styled(McIcon)`
    ${iconGap}
    ${fixPosition}
    ${fillIconWhite}
`;

const StyledPciDssIcon = styled(PciDssIcon)`
    ${iconGap}
    ${fixPosition}
    ${fillIconWhite}
`;

const LogoWrapper = styled.div`
    padding-left: 6px;
    fill: #fff;
`;

export const Footer: React.FC = () => {
    const locale = useAppSelector(getLocaleSelector);
    const brandless = useAppSelector(getAppConfigSelector).brandless;
    const isPaymentMethodBankCard = useAppSelector(getAvailablePaymentMethodSelector(PaymentMethodName.BankCard));
    return (
        <FooterWrapper>
            <SafePaymentContainer>
                {!brandless && (
                    <SafePayment>
                        <StyledSecureIcon />
                        <Label>{locale['footer.pay.label']}</Label>
                        <LogoWrapper>
                            <ReactSVG
                                src="/assets/logo.svg"
                                beforeInjection={(svg) => {
                                    svg.setAttribute('style', 'height: 24px; width: auto');
                                }}
                            />
                        </LogoWrapper>
                    </SafePayment>
                )}
                {isPaymentMethodBankCard && (
                    <SafeLogos>
                        <StyledVisaIcon />
                        <StyledMcIcon />
                        <StyledPciDssIcon />
                    </SafeLogos>
                )}
            </SafePaymentContainer>
        </FooterWrapper>
    );
};
