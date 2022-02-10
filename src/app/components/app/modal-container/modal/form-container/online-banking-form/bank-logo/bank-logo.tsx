import * as React from 'react';
import BankIcon from './bank.svg';
import { RoundIcon } from 'checkout/components';
import { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { Theme } from 'checkout/themes';
import { ReactSVG } from 'react-svg';
import styled from 'checkout/styled-components';

const StyledLogoWrapper = styled(RoundIcon)`
    & > *,
    svg {
        width: 24px;
        height: 24px;
    }
`;

export const BankLogo: React.FC<{ index?: number; src?: string; color?: string }> = ({
    children,
    index,
    src,
    color
}) => {
    const theme = useContext<Theme>(ThemeContext);

    return (
        <StyledLogoWrapper
            color={
                color ||
                (index
                    ? theme.color.iconBackgrounds[index % theme.color.iconBackgrounds.length]
                    : theme.color.iconBackgrounds[0])
            }>
            {src ? <ReactSVG src={src} /> : children || <BankIcon />}
        </StyledLogoWrapper>
    );
};
