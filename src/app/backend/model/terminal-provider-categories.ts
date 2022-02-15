export const terminalProviders = ['euroset', 'qps', 'uzcard', 'onlinebanking'] as const;
export type TerminalProviderCategories = typeof terminalProviders[number];
