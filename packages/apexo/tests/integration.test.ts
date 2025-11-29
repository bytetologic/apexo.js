import { isString } from '../src';

describe('ApexJS Integration', () => {
    it('should export isString from @apexjs/type', () => {
        expect(isString('hello')).toBe(true);
        expect(isString(123)).toBe(false);
    });
});
