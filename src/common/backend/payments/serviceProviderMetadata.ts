export const METADATA_NAMESPACE = 'dev.vality.checkout';

export type MetadataTextLocalization = {
    en?: string;
    ru?: string;
    pt?: string;
};

export type NumbersOnlyFormatter = {
    type: 'numbersOnly';
    maxLength?: number;
};

export type PhoneNumberFormatter = {
    type: 'phoneNumber';
    length: number;
};

export type MetadataFieldFormatter = NumbersOnlyFormatter | PhoneNumberFormatter;

export type AttributeType = JSX.IntrinsicElements['input']['type'];
export type AttributeInputMode = JSX.IntrinsicElements['input']['inputMode'];

export type ServiceProviderMetadataField = {
    type: AttributeType;
    name: string;
    required: boolean;
    pattern?: string;
    localization?: MetadataTextLocalization;
    index?: number;
    formatter?: MetadataFieldFormatter;
    inputMode?: AttributeInputMode;
    replaceValuePattern?: string;
    replaceValue?: string;
    telOnFocusValue?: string;
};

export type MetadataSelectSource =
    | {
          type: 'countrySubdivisions';
          countryCode?: string;
      }
    | {
          type: 'countryCodes';
      };

export type ServiceProviderMetadataSelect = {
    type: 'select';
    name: string;
    required: boolean;
    src: MetadataSelectSource;
    localization?: MetadataTextLocalization;
    index?: number;
};

export type ServiceProviderMetadataImage = {
    type?: 'image';
    src: string;
    width: string;
    height: string;
};

export type ServiceProviderMetadataBuildInIcon = {
    type: 'buildInIcon';
    name: 'HiCreditCard' | 'HiCash' | 'HiLibrary';
};

export type ServiceProviderMetadataLogo = ServiceProviderMetadataImage | ServiceProviderMetadataBuildInIcon;

export type ServiceProviderTitleMetadata = {
    icon: 'wallets' | 'online-banking' | 'bank-card';
    localization?: MetadataTextLocalization;
};

export type ServiceProviderContactInfo = {
    email: boolean;
    phoneNumber: boolean;
};

export type UserInteractionMetadata = {
    type: 'frame' | 'self';
};

export type QrCodeFormMetadata = {
    isCopyCodeBlock: boolean;
    qrCodeRedirect: 'mobile' | 'none';
};

export type PaymentSessionInfoMetadata = {
    redirectUrlInfo: {
        type: 'self' | 'outer';
    };
};

export type PrefilledMetadataValues = {
    [key: string]: string | number | boolean;
};

export type ServiceProviderMetadataForm = ServiceProviderMetadataField[] | ServiceProviderMetadataSelect[];

export type PinikleAddon = {
    type: 'pinikle';
    redirectLink: string;
};

export type Addon = PinikleAddon;

export type CheckoutServiceProviderMetadata = {
    form?: ServiceProviderMetadataForm;
    logo?: ServiceProviderMetadataLogo;
    title?: ServiceProviderTitleMetadata;
    contactInfo?: ServiceProviderContactInfo;
    userInteraction?: UserInteractionMetadata;
    qrCodeForm?: QrCodeFormMetadata;
    paymentSessionInfo?: PaymentSessionInfoMetadata;
    prefilledMetadataValues?: PrefilledMetadataValues;
    addon?: Addon;
};

export type ServiceProviderMetadata = {
    [METADATA_NAMESPACE]: CheckoutServiceProviderMetadata;
};
