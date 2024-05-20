import { Button, Text, VStack } from '@chakra-ui/react';
import { useContext } from 'react';

import { CheckoutServiceProviderMetadata } from 'checkout/backend/payments/serviceProviderMetadata';
import { LocaleContext } from 'checkout/contexts';
import { isNil } from 'checkout/utils';

export type PinikleAddonProps = {
    localePath: string;
    redirectLink: string;
};

export function PinikleAddon({ localePath, redirectLink }: PinikleAddonProps) {
    const locale = localePath['pinikle'];
    return (
        <VStack align="center" pt={3}>
            <Text fontSize="md" fontWeight="medium">
                {locale['label']}
            </Text>
            <Button colorScheme="teal" variant="link" onClick={() => window.open(redirectLink, '_blank')}>
                {locale['link']}
            </Button>
        </VStack>
    );
}

export type AddonProps = {
    addon: CheckoutServiceProviderMetadata['addon'];
};

export function Addon({ addon: { type, redirectLink } }: AddonProps) {
    const { l } = useContext(LocaleContext);

    const localePath = l['metadata.addons'];

    const renderAddon = () => {
        switch (type) {
            case 'pinikle':
                return <PinikleAddon localePath={localePath} redirectLink={redirectLink} />;
            default:
                return <></>;
        }
    };

    return <>{!isNil(localePath) && renderAddon()}</>;
}
