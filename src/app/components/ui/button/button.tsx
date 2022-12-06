import styled from 'checkout/styled-components';
import { css } from 'checkout/styled-components';

type ButtonType = 'primary' | 'default';

export const Button = styled.button<{ color?: ButtonType }>`
    text-align: center;
    padding: 12px;
    font-weight: 500;
    font-size: 16px;
    letter-spacing: 0;
    line-height: 20px;
    transition: all 0.3s;
    cursor: pointer;
    width: 100%;
    outline: none;

    ${({ theme, color }) =>
        color === 'primary'
            ? css`
                  border-radius: 32px;
                  color: ${theme.button.primaryText};
                  border: 2px solid ${({ theme }) => theme.button.color};
                  background: ${theme.button.color};

                  :hover {
                      background: ${theme.button.hover};
                      border-color: ${theme.button.hover};
                  }
              `
            : css`
                  border-radius: 4px;
                  background: #fff;
                  color: ${theme.button.outlineText};
                  border: 2px solid ${({ theme }) => theme.button.color};

                  :hover {
                      border-color: ${theme.button.hover};
                  }
              `};
`;
