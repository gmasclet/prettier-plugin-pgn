import * as assert from 'node:assert';
import {describe, it} from 'node:test';
import {parseMove} from '../src/parseMove';
import {Tokenizer} from '../src/tokenizer';

describe('parseMove', () => {
  it('should return undefined if there is no token', () => {
    const result = parseMove(new Tokenizer(''), 1);
    assert.strictEqual(result, undefined);
  });

  it('should return undefined if the first token is not a move token', () => {
    const result = parseMove(new Tokenizer('*'), 1);
    assert.strictEqual(result, undefined);
  });

  it('should parse a full move', () => {
    const result = parseMove(new Tokenizer('1.e4 e5'), 1);
    assert.deepStrictEqual(result, {
      type: 'fullMove',
      number: 1,
      white: {
        type: 'halfMove',
        value: 'e4',
        start: 0,
        end: 4
      },
      black: {
        type: 'halfMove',
        value: 'e5',
        start: 5,
        end: 7
      },
      start: 0,
      end: 7
    });
  });

  it('should parse a white move only', () => {
    const result = parseMove(new Tokenizer('1.Nf3'), 1);
    assert.deepStrictEqual(result, {
      type: 'whiteMove',
      number: 1,
      white: {
        type: 'halfMove',
        value: 'Nf3',
        start: 0,
        end: 5
      },
      start: 0,
      end: 5
    });
  });

  it('should parse a move without a number', () => {
    const result = parseMove(new Tokenizer('Nf3'), 1);
    assert.deepStrictEqual(result, {
      type: 'whiteMove',
      number: 1,
      white: {
        type: 'halfMove',
        value: 'Nf3',
        start: 0,
        end: 3
      },
      start: 0,
      end: 3
    });
  });

  it('should parse a move without a period', () => {
    const result = parseMove(new Tokenizer('1 Nf3'), 1);
    assert.deepStrictEqual(result, {
      type: 'whiteMove',
      number: 1,
      white: {
        type: 'halfMove',
        value: 'Nf3',
        start: 0,
        end: 5
      },
      start: 0,
      end: 5
    });
  });

  it('should parse a move with several periods', () => {
    const result = parseMove(new Tokenizer('1...Nf3'), 1);
    assert.deepStrictEqual(result, {
      type: 'whiteMove',
      number: 1,
      white: {
        type: 'halfMove',
        value: 'Nf3',
        start: 0,
        end: 7
      },
      start: 0,
      end: 7
    });
  });

  it('should throw if a number without a move is encountered', () => {
    assert.throws(() => {
      parseMove(new Tokenizer('42'), 1);
    });
  });

  it('should throw if an unexpected token is encountered', () => {
    assert.throws(() => {
      parseMove(new Tokenizer('42...*'), 1);
    });
  });
});
