import * as assert from 'node:assert';
import {describe, it} from 'node:test';
import {Tokenizer} from '../src/tokenizer';

describe('Tokenizer', () => {
  it('should accept a token of the correct type', () => {
    const token = new Tokenizer('[').accept('leftBracket');
    assert.deepStrictEqual(token, {type: 'leftBracket', start: 0, end: 1});
  });

  it('should return undefined when accepting a token of the wrong type', () => {
    const token = new Tokenizer('[').accept('integer');
    assert.strictEqual(token, undefined);
  });

  it('should return undefined when accepting a token at the end of the file', () => {
    const token = new Tokenizer('').accept('integer');
    assert.strictEqual(token, undefined);
  });

  it('should expect a token of the correct type', () => {
    const token = new Tokenizer('[').expect('leftBracket');
    assert.deepStrictEqual(token, {type: 'leftBracket', start: 0, end: 1});
  });

  it('should throw an error when expecting a token of the wrong type', () => {
    assert.throws(() => {
      new Tokenizer('[').expect('symbol');
    });
  });

  it('should throw an error when expecting a token at the end of the file', () => {
    assert.throws(() => {
      new Tokenizer('').expect('integer');
    });
  });

  it('should not throw an error when there are no tokens at the end of the file', () => {
    assert.doesNotThrow(() => {
      new Tokenizer('').expectEndOfFile();
    });
  });

  it('should throw an error when there are unexpected tokens at the end of the file', () => {
    assert.throws(() => {
      new Tokenizer('[').expectEndOfFile();
    });
  });

  it('should accept several tokens', () => {
    const tokens = new Tokenizer('1.e4');
    const result = [tokens.accept('integer'), tokens.accept('period'), tokens.accept('symbol')];
    assert.deepStrictEqual(result, [
      {type: 'integer', value: 1, start: 0, end: 1},
      {type: 'period', start: 1, end: 2},
      {type: 'symbol', value: 'e4', start: 2, end: 4}
    ]);
  });
});
