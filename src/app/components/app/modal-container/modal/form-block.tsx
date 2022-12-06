import styled, { css } from 'checkout/styled-components';
import { device } from 'checkout/utils/device';

export const FormBlock = styled.div<{ inFrame: boolean }>`
    position: relative;
    height: 100%;
    min-height: 100vh;
    width: 100%;
    background: ${({ theme }) => theme.form.background};

    footer {
        display: block;
    }

    @media ${device.desktop} {
        height: auto;
        min-height: auto;
        width: 680px;
        border-radius: 16px;
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        padding: 30px;
        box-sizing: border-box;

        footer {
            display: none !important;
        }
    }

    ${({ inFrame }) =>
        inFrame &&
        css`
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        `};
`;
