import sum from 'lodash-es/sum';

test('adds 1 + 2 to equal 3', () => {
    expect(sum([4, 2, 8, 6])).toBe(20);
});
