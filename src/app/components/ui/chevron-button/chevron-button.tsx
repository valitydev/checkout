import * as React from 'react';
import { styled, css } from 'styled-components';

import { ReactComponent as ChevronLeftIcon } from '../icon/chevron-left.svg';
import { ReactComponent as ChevronRightIcon } from '../icon/chevron-right.svg';

const Button = styled.button<{ disabled?: boolean }>`
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    svg {
        height: 16px;
        width: 16px;
        path {
            fill: ${({ theme }) => theme.chevronButton.color};
        }
    }

    ${({ disabled }) =>
        disabled &&
        css`
            cursor: default;
            svg {
                path {
                    fill: ${({ theme }) => theme.chevronButton.disabled};
                }
            }
        `}
`;

export type ChevronButtonProps = {
    type: 'left' | 'right';
    onClick: () => void;
    disabled?: boolean;
    id?: string;
};

export const ChevronButton: React.FC<ChevronButtonProps> = ({ id, onClick, type, disabled }) => (
    <Button aria-disabled={disabled} id={id} onClick={onClick} disabled={disabled}>
        {type === 'left' && <ChevronLeftIcon />} {type === 'right' && <ChevronRightIcon />}
    </Button>
);
