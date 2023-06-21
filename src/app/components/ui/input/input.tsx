import * as React from 'react';

import { Marks } from '../marks';
import { default as styled, css } from 'checkout/styled-components';
import { MutableRefObject, forwardRef } from 'react';

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

const StyledInput = styled.input<{ hasIcon?: boolean }>`
    margin: 0;
    width: 100%;
    height: 48px;
    box-sizing: border-box;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.input.border};
    font-weight: 500;
    font-size: 16px;
    letter-spacing: 0;
    padding-left: ${({ hasIcon }) => `${hasIcon ? CONTENT_OFFSET + ICON_SIZE + TEXT_ICON_OFFSET : CONTENT_OFFSET}px`};
    padding-right: ${CONTENT_OFFSET}px;
    appearance: none;
    transition: border-color 0.3s;
    outline: none;

    ::placeholder {
        color: ${({ theme }) => theme.input.placeholder};
        opacity: 1;
    }

    :focus {
        border-color: ${({ theme }) => theme.input.focus};
        border-width: 2px;
        padding-left: ${({ hasIcon }) =>
            `${(hasIcon ? CONTENT_OFFSET + ICON_SIZE + TEXT_ICON_OFFSET : CONTENT_OFFSET) - 1}px`};
        padding-right: ${CONTENT_OFFSET - 1}px;
    }
`;

const InputWrapper = styled.div<{ error?: any; mark?: boolean }>`
    position: relative;
    width: 100%;

    :nth-child(2) {
        margin-left: 10px;
    }

    ${(props) =>
        props.error &&
        css`
            ${StyledInput} {
                border-color: ${props.theme.input.error};
            }
        `};

    ${(props) =>
        props.mark &&
        css`
            ${StyledInput} {
                padding-right: 30px;

                :focus {
                    padding-right: 29px;
                }
            }
        `};
`;

export interface CustomProps {
    icon?: React.ReactNode;
    mark?: boolean;
    autocomplete?: string;
    spellcheck?: boolean;
    error?: any;
    active?: boolean;
    pristine?: boolean;
    inputRef?: MutableRefObject<HTMLInputElement>;
}

type InputProps = Omit<JSX.IntrinsicElements['input'], 'ref'> & CustomProps;

export const _Input: React.FC<InputProps> = ({
    className,
    error,
    mark,
    active,
    pristine,
    icon,
    inputRef,
    ...props
}) => (
    <InputWrapper {...{ className, error, mark }}>
        {icon && <Icon>{icon}</Icon>}
        <StyledInput {...props} hasIcon={!!icon} ref={inputRef} />
        {!!mark && <Marks {...{ active, pristine, error }} />}
    </InputWrapper>
);

export const Input = forwardRef<any, any>(function Input(
    { className, error, mark, active, pristine, icon, ...props },
    ref
) {
    return (
        <InputWrapper {...{ className, error, mark }}>
            {icon && <Icon>{icon}</Icon>}
            <StyledInput {...props} hasIcon={!!icon} ref={ref} />
            {!!mark && <Marks {...{ active, pristine, error }} />}
        </InputWrapper>
    );
});
