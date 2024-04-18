export type LocalePath = string;

export type IconName = 'CheckIcon' | 'WarningIcon' | 'InfoIcon';

export type ResultInfo = {
    iconName: IconName;
    label: LocalePath;
    color: string;
    description?: LocalePath;
    hasActions?: boolean;
};
