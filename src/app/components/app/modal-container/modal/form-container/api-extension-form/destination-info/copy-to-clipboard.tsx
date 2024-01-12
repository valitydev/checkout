import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Container = styled.div`
    cursor: pointer;
    height: 16px;
    width: 16px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const copy = (copyValue: string) => {
    const tempInput = document.createElement('input');
    tempInput.setAttribute('value', copyValue);
    tempInput.style.position = 'absolute';
    tempInput.style.left = '-1000px';
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
};

export type CopyToClipboardProps = {
    copyValue: string;
};

export const CopyToClipboard = ({ copyValue }: CopyToClipboardProps) => {
    const handleClick = () => {
        copy(copyValue);
    };

    return (
        <Container onClick={handleClick}>
            <motion.svg
                fill="currentColor"
                height="16"
                transition={{ duration: 0.3 }}
                viewBox="0 0 16 16"
                whileTap={{ translateY: 3 }}
                width="16"
            >
                <path d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
            </motion.svg>
        </Container>
    );
};
