import * as assert from 'node:assert';
import {describe, it} from 'node:test';
import {hasValue, noValue, repeat, castToError} from '../src/utils';

describe('utils.ts', () => {
  describe('hasValue', () => {
    it('should return true for non-null and non-undefined values', () => {
      assert.strictEqual(hasValue(1), true);
      assert.strictEqual(hasValue('test'), true);
      assert.strictEqual(hasValue({}), true);
      assert.strictEqual(hasValue([]), true);
    });

    it('should return false for null and undefined values', () => {
      assert.strictEqual(hasValue(null), false);
      assert.strictEqual(hasValue(undefined), false);
    });
  });

  describe('noValue', () => {
    it('should return true for null and undefined values', () => {
      assert.strictEqual(noValue(null), true);
      assert.strictEqual(noValue(undefined), true);
    });

    it('should return false for non-null and non-undefined values', () => {
      assert.strictEqual(noValue(1), false);
      assert.strictEqual(noValue('test'), false);
      assert.strictEqual(noValue({}), false);
      assert.strictEqual(noValue([]), false);
    });
  });

  describe('repeat', () => {
    it('should repeat the function until it returns undefined', () => {
      let i = 1;
      const result = repeat(() => (i <= 2 ? i++ : undefined));
      assert.deepStrictEqual(result, [1, 2]);
    });

    it('should return an empty array if parse returns undefined immediately', () => {
      const result = repeat(() => undefined);
      assert.deepStrictEqual(result, []);
    });
  });

  describe('castToError', () => {
    it('should return the same error if the throwable is an instance of Error', () => {
      const error = new Error('test error');
      assert.strictEqual(castToError(error), error);
    });

    it('should return a new error with the string representation of the throwable if it is not an instance of Error', () => {
      const throwable = 'test error';
      const result = castToError(throwable);
      assert(result instanceof Error);
      assert.strictEqual(result.message, 'test error');
    });
  });
});
