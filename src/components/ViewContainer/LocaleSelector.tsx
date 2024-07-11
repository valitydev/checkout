import { ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { useMemo, useState } from 'react';

import { isEmojiSupported } from 'checkout/utils';

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
    const isEmojiAvailable = useMemo(() => isEmojiSupported('🏳️'), []);

    return (
        <Menu>
            <MenuButton color="white">
                <Flex alignItems="center" gap="1">
                    {isEmojiAvailable && (
                        <Text as="span" fontSize="md">
                            {localeInfo[activeLocaleCode]?.flag}
                        </Text>
                    )}
                    <Text color="white" fontSize="md" fontWeight="bold">
                        {localeInfo[activeLocaleCode]?.short || activeLocaleCode}
                    </Text>
                    <ChevronDownIcon />
                </Flex>
            </MenuButton>
            <MenuList backgroundColor="viewContainerBg">
                {Object.entries(localeInfo).map(([code, { flag, long }]) => (
                    <MenuItem
                        key={code}
                        backgroundColor="viewContainerBg"
                        onClick={() => {
                            setActiveLocaleCode(code);
                            onLocaleChange(code);
                        }}
                    >
                        <Flex alignItems="center" gap="3">
                            {isEmojiAvailable && (
                                <Text as="span" fontSize="xl">
                                    {flag}
                                </Text>
                            )}
                            <Text color="bodyText" fontSize="md">
                                {long}
                            </Text>
                        </Flex>
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
}
