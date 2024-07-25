import { Flex, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';

const localeInfo = {
    ar: {
        flag: '🇸🇦',
        short: 'عر',
        long: 'العربية',
    },
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

export type LocaleSelectorProps = {
    initLocaleCode: string;
    onLocaleChange: (localeCode: string) => void;
};

export function LocaleSelector({ initLocaleCode, onLocaleChange }: LocaleSelectorProps) {
    const [activeLocaleCode, setActiveLocaleCode] = useState<string>(initLocaleCode);

    return (
        <Menu>
            <MenuButton color="white">
                <Flex alignItems="center" gap="1">
                    <Text as="span" fontSize="md">
                        {localeInfo[activeLocaleCode]?.flag}
                    </Text>
                    <Text color="white" fontSize="md" fontWeight="bold">
                        {localeInfo[activeLocaleCode]?.short || activeLocaleCode}
                    </Text>
                    <HiChevronDown />
                </Flex>
            </MenuButton>
            <MenuList>
                {Object.entries(localeInfo).map(([code, { flag, long }]) => (
                    <MenuItem
                        key={code}
                        onClick={() => {
                            setActiveLocaleCode(code);
                            onLocaleChange(code);
                        }}
                    >
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
