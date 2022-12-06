import * as React from 'react';
import { connect } from 'react-redux';

import { State } from 'checkout/state';
import { formatAmount } from 'checkout/utils';
import { Locale } from 'checkout/locale';
import { device } from 'checkout/utils/device';
import styled from 'checkout/styled-components';

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

export interface InfoProps {
    locale: Locale;
    name: string;
    description: string;
    formattedAmount: string;
}

const mapStateToProps = ({ config: { initConfig, locale }, amountInfo }: State): InfoProps => ({
    locale,
    name: initConfig.name,
    description: initConfig.description,
    formattedAmount: formatAmount(amountInfo)
});

const InfoDef: React.FC<InfoProps> = ({ formattedAmount, locale, name, description }) => (
    <InfoWrapper>
        {name ? <CompanyName id="company-name-label">{name}</CompanyName> : false}
        {formattedAmount ? <Amount>{formattedAmount}</Amount> : false}
        {description && (
            <DescriptionContainer>
                <Order>{locale['info.order.label']}</Order>
                <ProductDescription id="product-description">{description}</ProductDescription>
            </DescriptionContainer>
        )}
    </InfoWrapper>
);

export const Info = connect(mapStateToProps)(InfoDef);
