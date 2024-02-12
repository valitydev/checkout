import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';

import { ReactComponent as Checkmark } from './icon/checkmark.svg';

const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
};

const iconStyle = css`
    display: flex;
    position: absolute;
    right: 0;
    top: 0;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
`;

const CheckmarkIcon = styled(Checkmark)`
    ${iconStyle};
    height: 9px;
    width: 13px;
    margin: 19px 15px 0 19px;
    g {
        stroke: ${({ theme }) => theme.icons.checkmark};
    }
`;

export const Marks = () => (
    <motion.div animate="show" exit="exit" initial="hidden" variants={fadeIn}>
        <CheckmarkIcon />
    </motion.div>
);
