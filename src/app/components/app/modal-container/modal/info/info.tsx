import { useContext, useMemo } from 'react';
import styled from 'styled-components';

import { formatAmount } from 'checkout/utils';
import { device } from 'checkout/utils/device';

import { InitialContext } from '../../../initial-context';

const InfoWrapper = styled.div`
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    @media ${device.desktop} {
        padding: 24px 0;
        width: 230px;
        margin-right: 30px;
        gap: 24px;
    }
`;

const CompanyName = styled.h4`
    font-weight: 500;
    font-size: 16px;
    color: ${({ theme }) => theme.font.primaryColor};
    letter-spacing: 0;
    line-height: 20px;
    margin: 0;
`;

const Amount = styled.h1`
    font-weight: 500;
    font-size: 30px;
    color: ${({ theme }) => theme.font.primaryColor};
    letter-spacing: 0;
    line-height: 35px;
    margin: 0;
`;

const Order = styled.div`
    font-weight: 900;
    font-size: 11px;
    color: ${({ theme }) => theme.font.primaryColor};
    opacity: 0.5;
    letter-spacing: 2px;
    line-height: 15px;
    text-transform: uppercase;
    margin: 0;
`;

const ProductDescription = styled.div`
    font-weight: 500;
    font-size: 16px;
    color: ${({ theme }) => theme.font.primaryColor};
    letter-spacing: 0;
    line-height: 20px;
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

    return (
        <InfoWrapper>
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
