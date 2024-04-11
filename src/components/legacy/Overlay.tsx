import styled, { css } from 'styled-components';

const OverlayBg = styled.div`
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100vw;
    height: 100vh;

    ${({ theme }) => {
        return css`
            background: ${theme.background.gradient};
        `;
    }}
`;

export const Overlay = () => <OverlayBg key="overlay" />;
