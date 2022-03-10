import * as React from 'react';
import { KnownDigitalWalletProviders } from 'checkout/state';
import { assertUnreachable } from 'checkout/utils';
import { FormGroup } from '../form-group';
import { SticpayAccount, VenusPointAccount, VenusPointPassword } from './fields';

export const WalletProviderFormGroup: React.FC<{ provider: KnownDigitalWalletProviders }> = (props) => {
    switch (props.provider) {
        case KnownDigitalWalletProviders.Sticpay:
            return (
                <FormGroup>
                    <SticpayAccount />
                </FormGroup>
            );
        case KnownDigitalWalletProviders.Venuspoint:
            return (
                <>
                    <FormGroup>
                        <VenusPointAccount />
                    </FormGroup>
                    <FormGroup>
                        <VenusPointPassword />
                    </FormGroup>
                </>
            );
        default:
            assertUnreachable(props.provider);
    }
};
