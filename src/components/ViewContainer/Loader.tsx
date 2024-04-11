import { Flex, Spinner } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
};

export const Loader = () => (
    <motion.div animate="show" exit="exit" initial="hidden" variants={fadeIn}>
        <Flex
            alignItems="center"
            background="whiteAlpha.800"
            borderRadius="xl"
            height="100%"
            justifyContent="center"
            left={0}
            position="absolute"
            top={0}
            width="100%"
        >
            <Spinner color="teal.500" emptyColor="gray.200" size="xl" speed="0.65s" thickness="4px" />
        </Flex>
    </motion.div>
);
