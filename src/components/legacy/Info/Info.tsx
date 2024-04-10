import isMobile from 'ismobilejs';
import { useContext, useMemo } from 'react';
import styled from 'styled-components';

import { Back } from './Back';
import { LocaleContext } from '../../../common/contexts';
import { device } from '../../../common/utils';

const InfoWrapper = styled.div`
    padding: 16px 16px 0 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    @media ${device.desktop} {
        padding: 0;
        width: 258px;
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
    viewAmount: string;
    name?: string;
    description?: string;
};

export const Info = ({ name, description, viewAmount }: InfoProps) => {
    const { l } = useContext(LocaleContext);
    const isBackVisible = useMemo(() => isMobile(window.navigator).phone || isMobile(window.navigator).tablet, []);

    return (
        <InfoWrapper>
            {isBackVisible && (
                <div>
                    <Back locale={l} />
                </div>
            )}
            {viewAmount ? <Amount>{viewAmount}</Amount> : false}
            {name ? <CompanyName id="company-name-label">{name}</CompanyName> : false}
            {description && (
                <DescriptionContainer>
                    <Order>{l['info.order.label']}</Order>
                    <ProductDescription id="product-description">{description}</ProductDescription>
                </DescriptionContainer>
            )}
        </InfoWrapper>
    );
};
