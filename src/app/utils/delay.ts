const delay = (ms: number): Promise<undefined> => new Promise((resolve) => setTimeout(resolve, ms));

export default delay;
