import { Button, DarkMode, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { HiChevronDown, HiGlobeAlt } from 'react-icons/hi';

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
    en: {
        flag: '🇬🇧',
        short: 'En',
        long: 'English',
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
    tj: {
        flag: '🇹🇯',
        short: 'Тҷ',
        long: 'Тоҷикӣ',
    },
    uz: {
        flag: '🇺🇿',
        short: 'Uz',
        long: 'Oʻzbekcha',
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
            <DarkMode>
                <MenuButton
                    as={Button}
                    borderRadius="xl"
                    leftIcon={<HiGlobeAlt />}
                    rightIcon={<HiChevronDown />}
                    size="lg"
                    variant="ghost"
                >
                    {localeInfo[activeLocaleCode]?.short || activeLocaleCode}
                </MenuButton>
            </DarkMode>

            <MenuList borderRadius="xl">
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
