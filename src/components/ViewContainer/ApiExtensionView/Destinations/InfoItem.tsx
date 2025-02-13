import { VStack, Text, Flex, Spacer, Divider, useClipboard, useToast, IconButton } from '@chakra-ui/react';
import { ReactElement, cloneElement, useContext, useEffect, useMemo, useState } from 'react';
import { HiOutlineDuplicate } from 'react-icons/hi';

import { LocaleContext } from 'checkout/contexts';
import { isNil } from 'checkout/utils';

export type InfoItemProps = {
    label: string;
    value: string;
    icon?: ReactElement;
    isCopyable?: boolean;
    isDivider?: boolean;
    formatter?: (value: string) => Promise<string>;
    copyValueFormatter?: (value: string) => Promise<string>;
    whiteSpace?: 'nowrap' | 'normal';
};

export function InfoItem({
    label,
    value,
    isCopyable,
    formatter,
    icon,
    isDivider,
    copyValueFormatter,
    whiteSpace,
}: InfoItemProps) {
    const { l } = useContext(LocaleContext);
    const [copiedValue, setCopiedValue] = useState(value);
    const { onCopy, hasCopied } = useClipboard(copiedValue);
    const [displayValue, setDisplayValue] = useState(value);
    const toast = useToast();

    const isDividerVisible = useMemo(() => {
        if (isNil(isDivider)) {
            return true;
        }
        return isDivider;
    }, [isDivider]);

    useEffect(() => {
        if (!formatter) return;
        formatter(value).then(setDisplayValue);
    }, [value, formatter]);

    useEffect(() => {
        if (!copyValueFormatter) return;
        copyValueFormatter(value).then(setCopiedValue);
    }, [value, copyValueFormatter]);

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
                    <Text fontWeight="medium" textAlign="end" whiteSpace={whiteSpace ?? 'normal'}>
                        {displayValue}
                    </Text>
                    {isCopyable && (
                        <IconButton
                            aria-label="Copy"
                            colorScheme="gray"
                            fontSize="18px"
                            icon={<HiOutlineDuplicate />}
                            size="xs"
                            onClick={onCopy}
                        />
                    )}
                </Flex>
            </Flex>
            {isDividerVisible && <Divider />}
        </VStack>
    );
}
