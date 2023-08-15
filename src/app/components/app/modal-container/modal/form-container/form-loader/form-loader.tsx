import { motion } from 'framer-motion';
import * as React from 'react';
import styled from 'styled-components';

import { Loader } from 'checkout/components';

const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
};

const LoaderWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border-radius: 16px;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.9);
`;

export const FormLoader = () => (
    <motion.div animate="show" exit="exit" initial="hidden" variants={fadeIn}>
        <LoaderWrapper key="form-loader" id="form-loader">
            <Loader />
        </LoaderWrapper>
    </motion.div>
);
