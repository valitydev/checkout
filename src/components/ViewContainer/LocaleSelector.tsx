import { Button, DarkMode, Flex, Icon, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { AZ, KZ, GB, PT, RU, TJ, UZ } from 'country-flag-icons/react/3x2';
import { useState } from 'react';
import { HiChevronDown, HiGlobeAlt } from 'react-icons/hi';

const localeInfo = {
    az: {
        flag: <AZ />,
        short: 'Az',
        long: 'Azerbaijani',
    },
    kk: {
        flag: <KZ />,
        short: 'Kk',
        long: 'Қазақша',
    },
    en: {
        flag: <GB />,
        short: 'En',
        long: 'English',
    },
    pt: {
        flag: <PT />,
        short: 'Pt',
        long: 'Português',
    },
    ru: {
        flag: <RU />,
        short: 'Ру',
        long: 'Русский',
    },
    tj: {
        flag: <TJ />,
        short: 'Тҷ',
        long: 'Тоҷикӣ',
    },
    uz: {
        flag: <UZ />,
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
                {Object.entries(localeInfo).map(([code, { long, flag }]) => (
                    <MenuItem
                        key={code}
                        onClick={() => {
                            setActiveLocaleCode(code);
                            onLocaleChange(code);
                        }}
                    >
                        <Flex alignItems="center" gap="3">
                            <Icon boxSize={6}>{flag}</Icon>
                            <Text fontSize="md">{long}</Text>
                        </Flex>
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
}
