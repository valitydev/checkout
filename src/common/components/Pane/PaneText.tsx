import { Text, TextProps } from '@chakra-ui/react';

export function PaneText(props: TextProps) {
    const { children, ...rest } = props;
    return (
        <Text
            fontWeight="medium"
            overflow="hidden"
            textAlign="center"
            textOverflow="ellipsis"
            userSelect="none"
            whiteSpace="nowrap"
            {...rest}
        >
            {children}
        </Text>
    );
}
