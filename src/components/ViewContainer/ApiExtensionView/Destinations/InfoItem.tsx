import { VStack, Text, Flex, Spacer, Divider, useClipboard, useToast } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useContext, useEffect } from 'react';

import { LocaleContext } from 'checkout/contexts';

export type InfoItemProps = {
    label: string;
    value: string;
    isCopyable?: boolean;
};

const CopyIcon = ({ onClick }: { onClick: () => void }) => (
    <motion.svg
        cursor="pointer"
        fill="currentColor"
        height="16"
        transition={{ duration: 0.3 }}
        viewBox="0 0 16 16"
        whileTap={{ translateY: 3 }}
        width="16"
        onClick={onClick}
    >
        <path d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
    </motion.svg>
);

export function InfoItem({ label, value, isCopyable }: InfoItemProps) {
    const { l } = useContext(LocaleContext);
    const { onCopy, setValue, hasCopied } = useClipboard('');
    const toast = useToast();

    useEffect(() => {
        setValue(value);
    }, [value]);

    useEffect(() => {
        if (!hasCopied) return;
        toast({
            title: l['form.p2p.copied'],
            status: 'success',
            variant: 'subtle',
            duration: 3000,
        });
    }, [hasCopied]);

    return (
        <VStack align="stretch">
            <Flex>
                <Text>{label}</Text>
                <Spacer />
                <Flex alignItems="center" gap={2}>
                    <Text fontWeight="medium">{value}</Text>
                    {isCopyable && <CopyIcon onClick={onCopy} />}
                </Flex>
            </Flex>
            <Divider />
        </VStack>
    );
}
