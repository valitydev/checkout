export enum SlideDirection {
    right = 'slideRightAnimation',
    left = 'slideLeftAnimation',
    none = 'none'
}

export interface FormViewInfo {
    slideDirection: SlideDirection;
    height?: number;
    error?: boolean;
    inProcess?: boolean;
}
