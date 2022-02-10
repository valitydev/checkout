import * as React from 'react';
import BankIcon from './bank.svg';
import { RoundIcon } from 'checkout/components';
import { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { Theme } from 'checkout/themes';

export const BankLogo: React.FC<{ index: number }> = ({ children, index }) => {
    const theme = useContext<Theme>(ThemeContext);

    return (
        <RoundIcon color={theme.color.iconBackgrounds[index % theme.color.iconBackgrounds.length]}>
            {children || <BankIcon />}
        </RoundIcon>
    );
};
