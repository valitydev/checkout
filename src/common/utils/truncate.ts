export const truncate = (text: string, limit: number) =>
    text.length > limit ? text.substring(0, limit) + '...' : text;
