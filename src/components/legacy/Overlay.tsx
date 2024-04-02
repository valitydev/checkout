import styled, { css } from 'styled-components';

const OverlayBg = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    ${({ theme }) => {
        return css`
            background: ${theme.background.gradient};
        `;
    }}
`;

export const Overlay = () => <OverlayBg key="overlay" />;
