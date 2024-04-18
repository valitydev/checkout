import { CheckCircleIcon, WarningIcon, InfoIcon } from '@chakra-ui/icons';

const iconComponents = {
    CheckIcon: CheckCircleIcon,
    WarningIcon: WarningIcon,
    InfoIcon: InfoIcon,
};

export type ResultIconProps = {
    iconName: keyof typeof iconComponents;
    color: string;
};

export function ResultIcon({ iconName, color }: ResultIconProps) {
    const IconComponent = iconComponents[iconName];
    return IconComponent ? <IconComponent boxSize="28" color={color} /> : null;
}
