import isMobile from 'ismobilejs';
import { useMemo } from 'react';
import styled from 'styled-components';

import { Locale } from 'checkout/locale';

import { Back } from './Back';
import { formatAmount } from '../../../common/utils';
import { device } from '../../../common/utils';
import { PaymentAmount } from '../../../common/hooks/useInitPaymentModel';

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

export type InfoProps = {
    l: Locale;
    localeCode: string;
    paymentAmount: PaymentAmount;
    name?: string;
    description?: string;
};

export const Info = ({ name, description, l, paymentAmount, localeCode }: InfoProps) => {
    const formattedAmount = formatAmount(paymentAmount, localeCode);
    const isBackVisible = useMemo(() => isMobile(window.navigator).phone || isMobile(window.navigator).tablet, []);

    return (
        <InfoWrapper>
            {isBackVisible && (
                <div>
                    <Back locale={l} />
                </div>
            )}
            {name ? <CompanyName id="company-name-label">{name}</CompanyName> : false}
            {formattedAmount ? <Amount>{formattedAmount}</Amount> : false}
            {description && (
                <DescriptionContainer>
                    <Order>{l['info.order.label']}</Order>
                    <ProductDescription id="product-description">{description}</ProductDescription>
                </DescriptionContainer>
            )}
        </InfoWrapper>
    );
};
