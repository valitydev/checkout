import * as React from 'react';
import { default as styled, css } from 'checkout/styled-components';
import { Marks } from '../marks';

const StyledSelect = styled.select<{ isError: boolean; isPristine: boolean }>`
    margin: 0;
    width: 100%;
    height: 48px;
    box-sizing: border-box;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.neutral[0.2]};
    box-shadow: 0 0 0 0 #fff;
    font-weight: 500;
    font-size: 16px;
    color: ${({ theme }) => theme.color.neutral[0.9]};
    letter-spacing: 0;
    transition: border-color 0.3s;
    outline: none;
    appearance: none;
    background-color: #fff;
    cursor: pointer;
    padding: 0 15px;
    ${({ isError }) => {
        if (isError) {
            return css`
                border-color: ${({ theme }) => theme.color.error[1]};
            `;
        }
    }}
    ${({ isPristine }) => {
        if (isPristine) {
            return css`
                color: ${({ theme }) => theme.color.neutral[0.3]};
            `;
        }
    }}
`;

const SelectWrapper = styled.div`
    position: relative;
    width: 100%;
`;

export interface SelectProps {
    children: React.ReactNode;
    isError: boolean;
    isActive: boolean;
    isPristine: boolean;
    onChange: (value: string) => void;
}

export const Select = ({ children, onChange, isError, isActive, isPristine }: SelectProps) => (
    <SelectWrapper>
        <StyledSelect onChange={({ target: { value } }) => onChange(value)} isError={isError} isPristine={isPristine}>
            {children}
        </StyledSelect>
        <Marks active={isActive} pristine={isPristine} error={isError} />
    </SelectWrapper>
);
