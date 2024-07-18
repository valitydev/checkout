import { Flex, Spinner, useTheme } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
};

export const Loader = () => {
    const {
        Loader: { bg },
    } = useTheme();

    return (
        <motion.div animate="show" exit="exit" initial="hidden" variants={fadeIn}>
            <Flex
                alignItems="center"
                bg={bg}
                borderRadius="xl"
                height="100%"
                justifyContent="center"
                left={0}
                position="absolute"
                top={0}
                width="100%"
            >
                <Spinner color="brand.500" emptyColor="brand.200" size="xl" speed="0.65s" thickness="4px" />
            </Flex>
        </motion.div>
    );
};
