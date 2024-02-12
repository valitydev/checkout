import * as React from 'react';
import { forwardRef } from 'react';
import { styled, css } from 'styled-components';

import { Marks } from './Marks';

const StyledSelect = styled.select<{ $isError: boolean }>`
    margin: 0;
    width: 100%;
    height: 48px;
    box-sizing: border-box;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.input.border};
    font-weight: 500;
    font-size: 16px;
    letter-spacing: 0;
    transition: border-color 0.3s;
    outline: none;
    appearance: none;
    background-color: #fff;
    cursor: pointer;
    padding: 0 15px;
    ${({ $isError }) => {
        if ($isError) {
            return css`
                border-color: ${({ theme }) => theme.input.error};
                box-shadow: 0 0 0 1px ${({ theme }) => theme.input.error};
            `;
        }
    }}
`;

const SelectWrapper = styled.div`
    position: relative;
    width: 100%;
`;

export type SelectProps = {
    children: React.ReactNode;
    error: boolean;
    dirty: boolean;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ children, error, dirty, ...props }, ref) => (
    <SelectWrapper>
        <StyledSelect $isError={error} {...props} ref={ref}>
            {children}
        </StyledSelect>
        {!error && dirty && <Marks />}
    </SelectWrapper>
));

Select.displayName = 'Select';
