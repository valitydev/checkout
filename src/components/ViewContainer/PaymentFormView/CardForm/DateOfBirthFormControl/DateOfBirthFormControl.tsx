/* eslint-disable react/jsx-max-depth */
import { FormControl, InputGroup, InputLeftElement, Square, Input, VStack, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';
import { HiCalendar } from 'react-icons/hi';

import { StatusInputRightElement } from 'checkout/components';
import { LocaleContext } from 'checkout/contexts';
import { isNil } from 'checkout/utils';

import { CardFormInputs } from '../types';

export type DateOfBirthFormControlProps = {
    register: UseFormRegister<CardFormInputs>;
    formState: FormState<CardFormInputs>;
};

export function DateOfBirthFormControl({ register, formState: { errors, dirtyFields } }: DateOfBirthFormControlProps) {
    const { l } = useContext(LocaleContext);

    const inputRightElStatus = isNil(errors.dateOfBirth) && dirtyFields.dateOfBirth ? 'success' : 'unknown';

    const formatDate = (value: string, backspace: boolean) => {
        // Remove all non-digits
        let numbers = value.replace(/\D/g, '');

        // Handle backspace over a slash or space
        if (backspace && /[\s/]$/.test(value)) {
            numbers = numbers.slice(0, -1);
        }

        // Add slashes and spaces after valid day and month
        let result = '';

        // Handle day (first 2 digits)
        if (numbers.length >= 2) {
            const day = parseInt(numbers.slice(0, 2));
            if (day >= 1 && day <= 31) {
                result = `${numbers.slice(0, 2)} / `;
                // Handle month (next 2 digits)
                if (numbers.length >= 4) {
                    const month = parseInt(numbers.slice(2, 4));
                    if (month >= 1 && month <= 12) {
                        result += `${numbers.slice(2, 4)} / `;
                        // Add remaining digits for year
                        if (numbers.length > 4) {
                            result += numbers.slice(4, 8);
                        }
                    } else {
                        result += numbers.slice(2);
                    }
                } else {
                    result += numbers.slice(2);
                }
            } else {
                result = numbers;
            }
        } else {
            result = numbers;
        }

        return result;
    };

    const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isBackspace =
            e.nativeEvent instanceof InputEvent && (e.nativeEvent as InputEvent).inputType === 'deleteContentBackward';

        e.target.value = formatDate(e.target.value, isBackspace);
    };

    const validateDate = (value: string) => {
        if (!value) return 'Date is required';

        // Remove spaces before splitting
        const cleanValue = value.replace(/\s/g, '');
        const [day, month, year] = cleanValue.split('/').map(Number);
        const date = new Date(year, month - 1, day);

        // Check if it's a valid date and user is at least 18 years old
        const today = new Date();
        const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

        if (isNaN(date.getTime()) || date > today || date > minDate || day > 31 || month > 12 || year < 1900) {
            return 'Please enter a valid date of birth (must be 18 or older)';
        }

        return true;
    };

    return (
        <FormControl isInvalid={!isNil(errors.dateOfBirth)}>
            <VStack align="stretch" spacing={1}>
                <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none">
                        <Square as={HiCalendar} color="gray.400" />
                    </InputLeftElement>
                    <Input
                        {...register('dateOfBirth', {
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
