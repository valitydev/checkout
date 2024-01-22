import { motion } from 'framer-motion';
import { useContext } from 'react';
import styled from 'styled-components';

import { toContainer } from './utils';
import { PaymentModelContext } from '../../common/contexts';
import { UnifiedContainer } from '../UnifiedContainer';

const Wrapper = styled.div`
    height: 100%;
    position: relative;
`;

export function ContainerLayout() {
    const { model } = useContext(PaymentModelContext);
    const container = toContainer(model);

    return (
        <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 1 }}>
            <Wrapper>
                {container.name === 'unifiedContainer' && <UnifiedContainer />}
                {container.name === 'thirdPartyContainer' && <div>thirdPartyContainer</div>}
            </Wrapper>
        </motion.div>
    );
}
