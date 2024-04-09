import { ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { useContext } from 'react';

import { CustomizationContext } from 'checkout/contexts';

const localeInfo = {
    az: {
        flag: '🇦🇿',
        short: 'Az',
        long: 'Azerbaijani',
    },
    bn: {
        flag: '🇧🇩',
        short: 'বাং',
        long: 'বাংলা',
    },
    en: {
        flag: '🇬🇧',
        short: 'En',
        long: 'English',
    },
    ja: {
        flag: '🇯🇵',
        short: '日本',
        long: '日本語',
    },
    ko: {
        flag: '🇰🇷',
        short: '한국',
        long: '한국어',
    },
    pt: {
        flag: '🇵🇹',
        short: 'Pt',
        long: 'Português',
    },
    ru: {
        flag: '🇷🇺',
        short: 'Ру',
        long: 'Русский',
    },
    tr: {
        flag: '🇹🇷',
        short: 'Tr',
        long: 'Türkçe',
    },
};

export function LocaleSelector() {
    const { localeCode } = useContext(CustomizationContext);

    return (
        <Menu isLazy>
            <MenuButton color="white">
                <Flex alignItems="center" gap="1">
                    <Text as="span" fontSize="md">
                        {localeInfo[localeCode]?.flag || '🏳️'}
                    </Text>
                    <Text color="white" fontSize="md" fontWeight="bold">
                        {localeInfo[localeCode]?.short || localeCode}
                    </Text>
                    <ChevronDownIcon />
                </Flex>
            </MenuButton>
            <MenuList>
                {Object.entries(localeInfo).map(([code, { flag, long }]) => (
                    <MenuItem key={code}>
                        <Flex alignItems="center" gap="3">
                            <Text as="span" fontSize="xl">
                                {flag}
                            </Text>
                            <Text fontSize="md">{long}</Text>
                        </Flex>
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
}
