import { VStack, Text, Flex, Spacer, Divider, useClipboard, useToast, IconButton, createIcon } from '@chakra-ui/react';
import { ReactElement, cloneElement, useContext, useEffect, useState } from 'react';

import { LocaleContext } from 'checkout/contexts';

export type InfoItemProps = {
    label: string;
    value: string;
    icon?: ReactElement;
    isCopyable?: boolean;
    formatter?: (value: string) => Promise<string>;
};

export const CopyIcon = createIcon({
    displayName: 'CopyIcon',
    viewBox: '0 0 16 16',
    path: (
        <path d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
    ),
});

export function InfoItem({ label, value, isCopyable, formatter, icon }: InfoItemProps) {
    const { l } = useContext(LocaleContext);
    const { onCopy, hasCopied } = useClipboard(value);
    const [displayValue, setDisplayValue] = useState(value);
    const toast = useToast();

    useEffect(() => {
        if (!formatter) return;
        formatter(value).then(setDisplayValue);
    }, [value, formatter]);

    useEffect(() => {
        setDisplayValue(value);
    }, [value]);

    useEffect(() => {
        if (!hasCopied) return;
        toast({
            title: l['form.p2p.copied'],
            status: 'success',
            variant: 'subtle',
            duration: 3000,
        });
    }, [hasCopied, l]);

    const IconContainer = () => (
        <Flex alignItems="center" boxSize="5" justifyContent="center">
            {cloneElement(icon, { boxSize: '100%' })}
        </Flex>
    );

    return (
        <VStack align="stretch">
            <Flex>
                <Text>{label}</Text>
                <Spacer />
                <Flex alignItems="center" gap={2}>
                    {icon && <IconContainer />}
                    <Text fontWeight="medium" textAlign="end">
                        {displayValue}
                    </Text>
                    {isCopyable && <IconButton aria-label="Copy" icon={<CopyIcon />} size="xs" onClick={onCopy} />}
                </Flex>
            </Flex>
            <Divider />
        </VStack>
    );
}
