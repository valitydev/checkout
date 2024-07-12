import * as React from 'react';
import { forwardRef } from 'react';
import { styled, css } from 'styled-components';

import { Marks } from './Marks';

const CONTENT_OFFSET = 15;
const TEXT_ICON_OFFSET = 8;
const ICON_SIZE = 18;

const Icon = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    margin: ${CONTENT_OFFSET}px 0 ${CONTENT_OFFSET}px ${CONTENT_OFFSET}px;
    width: ${ICON_SIZE}px;
    height: ${ICON_SIZE}px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    opacity: 1;
`;

const StyledInput = styled.input<{ $hasIcon?: boolean }>`
    background-color: ${({ theme }) => theme.input.backgroundColor};
    color: ${({ theme }) => theme.input.color};
    margin: 0;
    width: 100%;
    height: 48px;
    box-sizing: border-box;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.input.border};
    font-weight: 500;
    font-size: 16px;
    letter-spacing: 0;
    padding-left: ${({ $hasIcon }) => `${$hasIcon ? CONTENT_OFFSET + ICON_SIZE + TEXT_ICON_OFFSET : CONTENT_OFFSET}px`};
    padding-right: ${CONTENT_OFFSET}px;
    appearance: none;
    /* transition: border-color 0.3s; */

    ::placeholder {
        color: ${({ theme }) => theme.input.placeholder};
        /* opacity: 1; */
    }

    &:focus-visible {
        border-color: ${({ theme }) => theme.input.focus};
        border-width: 1px;
        box-shadow: 0 0 0 1px ${({ theme }) => theme.input.focus};
        outline: transparent solid 2px;
        outline-offset: 2px;
    }
`;

const InputWrapper = styled.div<{ $error?: any; $mark?: boolean }>`
    position: relative;
    width: 100%;

    ${({ $error, theme }) =>
        $error &&
        css`
            ${StyledInput} {
                border-color: ${theme.input.error};
                box-shadow: 0 0 0 1px ${({ theme }) => theme.input.error};
            }
        `};

    ${({ $mark }) =>
        $mark &&
        css`
            ${StyledInput} {
                padding-right: 30px;
            }
        `};
`;

export type InputProps = JSX.IntrinsicElements['input'] & {
    icon?: React.ReactNode;
    mark?: boolean;
    error?: boolean;
    dirty?: boolean;
    autoComplete?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, dirty, mark, icon, ...props }, ref) => (
        <InputWrapper {...{ className, $error: error, $mark: mark }}>
            {icon && <Icon>{icon}</Icon>}
            <StyledInput {...props} ref={ref} $hasIcon={!!icon} />
            {mark && dirty && !error && <Marks />}
        </InputWrapper>
    ),
);

Input.displayName = 'Input';
