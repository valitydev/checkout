import * as React from 'react';
import { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { Bank, RoundIcon } from 'checkout/components';
import { Theme } from 'checkout/themes';
import styled from 'checkout/styled-components';

const DefaultLogo = styled(Bank)`
    width: 24px;
    height: 24px;
    path {
        fill: #fff;
    }
`;

const getRoundIconColor = (theme: Theme, index?: number): string => {
    const colors = theme.color.iconBackgrounds;
    return index ? colors[index % colors.length] : colors[0];
};

export const BankLogo: React.FC<{ index?: number }> = ({ index }) => {
    const theme = useContext<Theme>(ThemeContext);
    return (
        <RoundIcon color={getRoundIconColor(theme, index)}>
            <DefaultLogo />
        </RoundIcon>
    );
};
