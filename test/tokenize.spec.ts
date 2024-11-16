import * as assert from 'node:assert';
import {describe, it} from 'node:test';
import {tokenize} from '../src/tokenize';

describe('tokenize', () => {
  it('should tokenize a empty string', () => {
    const tokens = tokenize('');
    assert.deepStrictEqual(tokens, []);
  });

  it('should tokenize a period', () => {
    const tokens = tokenize('.');
    assert.deepStrictEqual(tokens, [{type: 'period', start: 0, end: 1}]);
  });

  it('should tokenize an asterisk', () => {
    const tokens = tokenize('*');
    assert.deepStrictEqual(tokens, [{type: 'asterisk', start: 0, end: 1}]);
  });

  it('should tokenize brackets', () => {
    const tokens = tokenize('[]');
    assert.deepStrictEqual(tokens, [
      {type: 'leftBracket', start: 0, end: 1},
      {type: 'rightBracket', start: 1, end: 2}
    ]);
  });

  it('should tokenize parentheses', () => {
    const tokens = tokenize('()');
    assert.deepStrictEqual(tokens, [
      {type: 'leftParenthesis', start: 0, end: 1},
      {type: 'rightParenthesis', start: 1, end: 2}
    ]);
  });

  it('should tokenize angle brackets', () => {
    const tokens = tokenize('<>');
    assert.deepStrictEqual(tokens, [
      {type: 'leftAngleBracket', start: 0, end: 1},
      {type: 'rightAngleBracket', start: 1, end: 2}
    ]);
  });

  it('should tokenize a string', () => {
    const tokens = tokenize('"hello"');
    assert.deepStrictEqual(tokens, [{type: 'string', value: 'hello', start: 0, end: 7}]);
  });

  it('should tokenize a string containing a quote', () => {
    const tokens = tokenize('"hello \\"quote\\""');
    assert.deepStrictEqual(tokens, [{type: 'string', value: 'hello "quote"', start: 0, end: 17}]);
  });

  it('should tokenize a string containing a backslash', () => {
    const tokens = tokenize('"hello \\\\"');
    assert.deepStrictEqual(tokens, [{type: 'string', value: 'hello \\', start: 0, end: 10}]);
  });

  it('should tokenize a string containing a non-escaped backslash', () => {
    const tokens = tokenize('"hello \\ "');
    assert.deepStrictEqual(tokens, [{type: 'string', value: 'hello  ', start: 0, end: 10}]);
  });

  it('should tokenize an unterminated string', () => {
    const tokens = tokenize('"hello');
    assert.deepStrictEqual(tokens, [{type: 'string', value: 'hello', start: 0, end: 6}]);
  });

  it('should tokenize an unterminated string ending with a non-escaped backslash', () => {
    const tokens = tokenize('"hello \\');
    assert.deepStrictEqual(tokens, [{type: 'string', value: 'hello ', start: 0, end: 8}]);
  });

  it('should tokenize a NAG', () => {
    const tokens = tokenize('$1');
    assert.deepStrictEqual(tokens, [{type: 'nag', value: 1, start: 0, end: 2}]);
  });

  it('should tokenize a simple move symbol', () => {
    const tokens = tokenize('e4');
    assert.deepStrictEqual(tokens, [{type: 'symbol', value: 'e4', start: 0, end: 2}]);
  });

  it('should tokenize a capture move symbol', () => {
    const tokens = tokenize('Nxc7');
    assert.deepStrictEqual(tokens, [{type: 'symbol', value: 'Nxc7', start: 0, end: 4}]);
  });

  it('should tokenize a check move symbol', () => {
    const tokens = tokenize('Re1+');
    assert.deepStrictEqual(tokens, [{type: 'symbol', value: 'Re1+', start: 0, end: 4}]);
  });

  it('should tokenize a checkmate move symbol', () => {
    const tokens = tokenize('Re8#');
    assert.deepStrictEqual(tokens, [{type: 'symbol', value: 'Re8#', start: 0, end: 4}]);
  });

  it('should tokenize a promotion move symbol', () => {
    const tokens = tokenize('d8=Q');
    assert.deepStrictEqual(tokens, [{type: 'symbol', value: 'd8=Q', start: 0, end: 4}]);
  });

  it('should tokenize the kingside castle symbol', () => {
    const tokens = tokenize('O-O');
    assert.deepStrictEqual(tokens, [{type: 'symbol', value: 'O-O', start: 0, end: 3}]);
  });

  it('should tokenize the queenside castle symbol', () => {
    const tokens = tokenize('O-O-O');
    assert.deepStrictEqual(tokens, [{type: 'symbol', value: 'O-O-O', start: 0, end: 5}]);
  });

  it('should tokenize the white win symbol', () => {
    const tokens = tokenize('1-0');
    assert.deepStrictEqual(tokens, [{type: 'symbol', value: '1-0', start: 0, end: 3}]);
  });

  it('should tokenize the black win symbol', () => {
    const tokens = tokenize('0-1');
    assert.deepStrictEqual(tokens, [{type: 'symbol', value: '0-1', start: 0, end: 3}]);
  });

  it('should tokenize the draw symbol', () => {
    const tokens = tokenize('1/2-1/2');
    assert.deepStrictEqual(tokens, [{type: 'symbol', value: '1/2-1/2', start: 0, end: 7}]);
  });

  it('should tokenize a single digit integer', () => {
    const tokens = tokenize('1');
    assert.deepStrictEqual(tokens, [{type: 'integer', value: 1, start: 0, end: 1}]);
  });

  it('should tokenize a multi-digit integer', () => {
    const tokens = tokenize('207');
    assert.deepStrictEqual(tokens, [{type: 'integer', value: 207, start: 0, end: 3}]);
  });

  it('should tokenize a complex PGN text', () => {
    const tokens = tokenize('[Event "F/S Return Match"]\n\n1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 *');
    assert.deepStrictEqual(tokens, [
      {type: 'leftBracket', start: 0, end: 1},
      {type: 'symbol', value: 'Event', start: 1, end: 6},
      {type: 'string', value: 'F/S Return Match', start: 7, end: 25},
      {type: 'rightBracket', start: 25, end: 26},
      {type: 'integer', value: 1, start: 28, end: 29},
      {type: 'period', start: 29, end: 30},
      {type: 'symbol', value: 'e4', start: 31, end: 33},
      {type: 'symbol', value: 'e5', start: 34, end: 36},
      {type: 'integer', value: 2, start: 37, end: 38},
      {type: 'period', start: 38, end: 39},
      {type: 'symbol', value: 'Nf3', start: 40, end: 43},
      {type: 'symbol', value: 'Nc6', start: 44, end: 47},
      {type: 'integer', value: 3, start: 48, end: 49},
      {type: 'period', start: 49, end: 50},
      {type: 'symbol', value: 'Bb5', start: 51, end: 54},
      {type: 'symbol', value: 'a6', start: 55, end: 57},
      {type: 'asterisk', start: 58, end: 59}
    ]);
  });

  it('should throw if an invalid character is encountered', () => {
    assert.throws(() => {
      tokenize('@');
    });
  });
});
