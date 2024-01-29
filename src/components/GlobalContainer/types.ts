type ThirdPartyContainer = {
    name: 'ThirdPartyContainer';
};

type ViewContainer = {
    name: 'ViewContainer';
};

type SelfRedirectContainer = {
    name: 'SelfRedirectContainer';
};

export type Container = ThirdPartyContainer | SelfRedirectContainer | ViewContainer;
