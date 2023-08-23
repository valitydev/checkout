import isMobile from 'ismobilejs';
import { useContext, useMemo } from 'react';
import styled from 'styled-components';

import { formatAmount } from 'checkout/utils';
import { device } from 'checkout/utils/device';

import { Back } from './back';
import { InitialContext } from '../../../initial-context';

const InfoWrapper = styled.div`
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    @media ${device.desktop} {
        padding: 24px 0;
        width: 230px;
        margin-right: 30px;
    }
`;

const CompanyName = styled.p`
    font-weight: 500;
    font-size: 18px;
    color: ${({ theme }) => theme.font.primaryColor};
    margin: 0;
`;

const Amount = styled.p`
    font-weight: 500;
    font-size: 32px;
    color: ${({ theme }) => theme.font.primaryColor};
    margin: 0;
`;

const Order = styled.p`
    font-weight: 900;
    font-size: 12px;
    color: ${({ theme }) => theme.font.primaryColor};
    opacity: 0.5;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin: 0;
`;

const ProductDescription = styled.p`
    font-weight: 500;
    font-size: 16px;
    color: ${({ theme }) => theme.font.primaryColor};
    margin: 0;
`;

const DescriptionContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const Info = () => {
    const { locale, initConfig, amountInfo } = useContext(InitialContext);
    const formattedAmount = useMemo(() => formatAmount(amountInfo), [amountInfo]);
    const isBackVisible = useMemo(() => isMobile(window.navigator).phone || isMobile(window.navigator).tablet, []);

    return (
        <InfoWrapper>
            {isBackVisible && (
                <div>
                    <Back locale={locale} />
                </div>
            )}
            {initConfig.name ? <CompanyName id="company-name-label">{initConfig.name}</CompanyName> : false}
            {formattedAmount ? <Amount>{formattedAmount}</Amount> : false}
            {initConfig.description && (
                <DescriptionContainer>
                    <Order>{locale['info.order.label']}</Order>
                    <ProductDescription id="product-description">{initConfig.description}</ProductDescription>
                </DescriptionContainer>
            )}
        </InfoWrapper>
    );
};
