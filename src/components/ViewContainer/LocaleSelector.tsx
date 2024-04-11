import { ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';

import { CustomizationContext, Locale } from 'checkout/contexts';

import { useLocale } from './useLocale';

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

export type LocaleSelectorProps = {
    onLocaleChange: (locale: { l: Locale; localeCode: string }) => void;
};

export function LocaleSelector({ onLocaleChange }: LocaleSelectorProps) {
    const { initLocaleCode } = useContext(CustomizationContext);
    const { localeState, loadLocale } = useLocale();
    const [activeLocaleCode, setActiveLocaleCode] = useState<string>(initLocaleCode);

    useEffect(() => {
        loadLocale(initLocaleCode);
    }, [initLocaleCode]);

    useEffect(() => {
        if (localeState.status === 'SUCCESS') {
            onLocaleChange({ l: localeState.data, localeCode: activeLocaleCode });
        }
    }, [localeState, activeLocaleCode]);

    return (
        <Menu isLazy>
            <MenuButton color="white">
                <Flex alignItems="center" gap="1">
                    <Text as="span" fontSize="md">
                        {localeInfo[activeLocaleCode]?.flag || '🏳️'}
                    </Text>
                    <Text color="white" fontSize="md" fontWeight="bold">
                        {localeInfo[activeLocaleCode]?.short || activeLocaleCode}
                    </Text>
                    <ChevronDownIcon />
                </Flex>
            </MenuButton>
            <MenuList>
                {Object.entries(localeInfo).map(([code, { flag, long }]) => (
                    <MenuItem
                        key={code}
                        onClick={() => {
                            setActiveLocaleCode(code);
                            loadLocale(code);
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
