import { motion } from 'framer-motion';
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

export const Overlay = () => (
    <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 0.5 }}>
        <OverlayBg key="overlay" />
    </motion.div>
);
