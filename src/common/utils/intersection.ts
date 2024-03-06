export const intersection = <T>(arr: T[], ...args: [T[]]) =>
    arr.filter((item) => args.every((arr) => arr.includes(item)));
