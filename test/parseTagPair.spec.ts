import * as assert from 'node:assert';
import {describe, it} from 'node:test';
import {parseTagPair} from '../src/parseTagPair';
import {Tokenizer} from '../src/tokenizer';

describe('parseTagPair', () => {
  it('should return undefined if there is no token', () => {
    const result = parseTagPair(new Tokenizer(''));
    assert.strictEqual(result, undefined);
  });

  it('should return undefined if the first token is not a left bracket', () => {
    const result = parseTagPair(new Tokenizer('1.e4 e5 *'));
    assert.strictEqual(result, undefined);
  });

  it('should parse a tag pair', () => {
    const result = parseTagPair(new Tokenizer('[Event "F/S Return Match"]'));
    assert.deepStrictEqual(result, {
      type: 'tagPair',
      name: 'Event',
      value: 'F/S Return Match',
      start: 0,
      end: 26
    });
  });

  it('should parse a tag pair without right bracket', () => {
    const result = parseTagPair(new Tokenizer('[Event "F/S Return Match"'));
    assert.deepStrictEqual(result, {
      type: 'tagPair',
      name: 'Event',
      value: 'F/S Return Match',
      start: 0,
      end: 25
    });
  });

  it('should throw if a tag pair without a value is encountered', () => {
    assert.throws(() => {
      parseTagPair(new Tokenizer('[Event'));
    });
  });

  it('should throw if a left bracket is encountered alone', () => {
    assert.throws(() => {
      parseTagPair(new Tokenizer('['));
    });
  });
});
