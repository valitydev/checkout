import { InputRightElement, InputRightElementProps, Square, useColorModeValue } from '@chakra-ui/react';
import { HiCheck } from 'react-icons/hi';

export type StatusInputRightElementProps = {
    status: 'unknown' | 'success';
} & InputRightElementProps;

export function StatusInputRightElement(props: StatusInputRightElementProps) {
    const { status, ...rest } = props;
    const checkColor = useColorModeValue('green.600', 'green.300');

    return (
        <InputRightElement {...rest}>
            {status === 'success' && <Square as={HiCheck} color={checkColor} />}
        </InputRightElement>
    );
}
