/* eslint-disable react/jsx-max-depth */
import { FormControl, InputGroup, InputLeftElement, Square, Input, VStack, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';
import { HiCalendar } from 'react-icons/hi';

import { StatusInputRightElement } from 'checkout/components';
import { LocaleContext } from 'checkout/contexts';
import { isNil } from 'checkout/utils';

import { handleDateInput, validateDate } from './utils';
import { CardFormInputs } from '../types';

export type DateOfBirthFormControlProps = {
    register: UseFormRegister<CardFormInputs>;
    formState: FormState<CardFormInputs>;
};

export function DateOfBirthFormControl({ register, formState: { errors, dirtyFields } }: DateOfBirthFormControlProps) {
    const { l } = useContext(LocaleContext);

    const inputRightElStatus =
        isNil(errors?.contactInfo?.dateOfBirth) && dirtyFields?.contactInfo?.dateOfBirth ? 'success' : 'unknown';

    return (
        <FormControl isInvalid={!isNil(errors?.contactInfo?.dateOfBirth)}>
            <VStack align="stretch" spacing={1}>
                <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none">
                        <Square as={HiCalendar} color="gray.400" />
                    </InputLeftElement>
                    <Input
                        {...register('contactInfo.dateOfBirth', {
                            required: true,
                            validate: validateDate,
                            onChange: handleDateInput,
                        })}
                        maxLength={16} // Updated to account for spaces
                        placeholder={l['form.input.dateOfBirth.placeholder']}
                        type="text"
                    />
                    <StatusInputRightElement status={inputRightElStatus} />
                </InputGroup>
                <Text color="gray.500" fontSize="sm">
                    {l['form.input.dateOfBirth.hint']}
                </Text>
            </VStack>
        </FormControl>
    );
}
