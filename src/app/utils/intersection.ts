const intersection = <T>(arr: Array<T>, ...args: Array<Array<T>>) =>
    arr.filter((item) => args.every((arr) => arr.includes(item)));

export default intersection;
