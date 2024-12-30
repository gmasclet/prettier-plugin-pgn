import * as assert from 'node:assert';
import {describe, it} from 'node:test';
import {parseToken} from '../src/parseToken';

describe('parseToken', () => {
  it('should parse an empty string', () => {
    const token = parseToken('', 0);
    assert.deepStrictEqual(token, undefined);
  });

  it('should parse a period', () => {
    const token = parseToken('.', 0);
    assert.deepStrictEqual(token, {type: 'period', start: 0, end: 1});
  });

  it('should parse a left bracket', () => {
    const token = parseToken('[', 0);
    assert.deepStrictEqual(token, {type: 'leftBracket', start: 0, end: 1});
  });

  it('should parse a right bracket', () => {
    const token = parseToken(']', 0);
    assert.deepStrictEqual(token, {type: 'rightBracket', start: 0, end: 1});
  });

  it('should parse a left parenthesis', () => {
    const token = parseToken('(', 0);
    assert.deepStrictEqual(token, {type: 'leftParenthesis', start: 0, end: 1});
  });

  it('should parse a right parenthesis', () => {
    const token = parseToken(')', 0);
    assert.deepStrictEqual(token, {type: 'rightParenthesis', start: 0, end: 1});
  });

  it('should parse a string', () => {
    const token = parseToken('"hello"', 0);
    assert.deepStrictEqual(token, {type: 'string', value: 'hello', start: 0, end: 7});
  });

  it('should parse a string containing a quote', () => {
    const token = parseToken('"hello \\"quote\\""', 0);
    assert.deepStrictEqual(token, {type: 'string', value: 'hello "quote"', start: 0, end: 17});
  });

  it('should parse a string containing a backslash', () => {
    const token = parseToken('"hello \\\\"', 0);
    assert.deepStrictEqual(token, {type: 'string', value: 'hello \\', start: 0, end: 10});
  });

  it('should parse a string containing a non-escaped backslash', () => {
    const token = parseToken('"hello \\ "', 0);
    assert.deepStrictEqual(token, {type: 'string', value: 'hello  ', start: 0, end: 10});
  });

  it('should parse an unterminated string', () => {
    const token = parseToken('"hello', 0);
    assert.deepStrictEqual(token, {type: 'string', value: 'hello', start: 0, end: 6});
  });

  it('should parse an unterminated string ending with a non-escaped backslash', () => {
    const token = parseToken('"hello \\', 0);
    assert.deepStrictEqual(token, {type: 'string', value: 'hello ', start: 0, end: 8});
  });

  it('should parse a numeric annotation glyph', () => {
    const token = parseToken('$1', 0);
    assert.deepStrictEqual(token, {type: 'annotation', value: '$1', start: 0, end: 2});
  });

  it(`should parse the "!" annotation`, () => {
    const token = parseToken('!', 0);
    assert.deepStrictEqual(token, {type: 'annotation', value: '!', start: 0, end: 1});
  });

  it(`should parse the "!!" annotation`, () => {
    const token = parseToken('!!', 0);
    assert.deepStrictEqual(token, {type: 'annotation', value: '!!', start: 0, end: 2});
  });

  it(`should parse the "?" annotation`, () => {
    const token = parseToken('?', 0);
    assert.deepStrictEqual(token, {type: 'annotation', value: '?', start: 0, end: 1});
  });

  it(`should parse the "??" annotation`, () => {
    const token = parseToken('??', 0);
    assert.deepStrictEqual(token, {type: 'annotation', value: '??', start: 0, end: 2});
  });

  it(`should parse the "!?" annotation`, () => {
    const token = parseToken('!?', 0);
    assert.deepStrictEqual(token, {type: 'annotation', value: '!?', start: 0, end: 2});
  });

  it(`should parse the "?!" annotation`, () => {
    const token = parseToken('?!', 0);
    assert.deepStrictEqual(token, {type: 'annotation', value: '?!', start: 0, end: 2});
  });

  it(`should parse the "+--" annotation`, () => {
    const token = parseToken('+--', 0);
    assert.deepStrictEqual(token, {type: 'annotation', value: '+--', start: 0, end: 3});
  });

  it(`should parse the "+-" annotation`, () => {
    const token = parseToken('+-', 0);
    assert.deepStrictEqual(token, {type: 'annotation', value: '+-', start: 0, end: 2});
  });

  it(`should parse the "+/-" annotation`, () => {
    const token = parseToken('+/-', 0);
    assert.deepStrictEqual(token, {type: 'annotation', value: '+/-', start: 0, end: 3});
  });

  it(`should parse the "+=" annotation`, () => {
    const token = parseToken('+=', 0);
    assert.deepStrictEqual(token, {type: 'annotation', value: '+=', start: 0, end: 2});
  });

  it(`should parse the "--+" annotation`, () => {
    const token = parseToken('--+', 0);
    assert.deepStrictEqual(token, {type: 'annotation', value: '--+', start: 0, end: 3});
  });

  it(`should parse the "-+" annotation`, () => {
    const token = parseToken('-+', 0);
    assert.deepStrictEqual(token, {type: 'annotation', value: '-+', start: 0, end: 2});
  });

  it(`should parse the "-/+" annotation`, () => {
    const token = parseToken('-/+', 0);
    assert.deepStrictEqual(token, {type: 'annotation', value: '-/+', start: 0, end: 3});
  });

  it(`should parse the "=+" annotation`, () => {
    const token = parseToken('=+', 0);
    assert.deepStrictEqual(token, {type: 'annotation', value: '=+', start: 0, end: 2});
  });

  it(`should parse the "=" annotation`, () => {
    const token = parseToken('=', 0);
    assert.deepStrictEqual(token, {type: 'annotation', value: '=', start: 0, end: 1});
  });

  it(`should parse the "~" annotation`, () => {
    const token = parseToken('~', 0);
    assert.deepStrictEqual(token, {type: 'annotation', value: '~', start: 0, end: 1});
  });

  it('should parse a simple move symbol', () => {
    const token = parseToken('e4', 0);
    assert.deepStrictEqual(token, {type: 'symbol', value: 'e4', start: 0, end: 2});
  });

  it('should parse a capture move symbol', () => {
    const token = parseToken('Nxc7', 0);
    assert.deepStrictEqual(token, {type: 'symbol', value: 'Nxc7', start: 0, end: 4});
  });

  it('should parse a check move symbol', () => {
    const token = parseToken('Re1+', 0);
    assert.deepStrictEqual(token, {type: 'symbol', value: 'Re1+', start: 0, end: 4});
  });

  it('should parse a checkmate move symbol', () => {
    const token = parseToken('Re8#', 0);
    assert.deepStrictEqual(token, {type: 'symbol', value: 'Re8#', start: 0, end: 4});
  });

  it('should parse a promotion move symbol', () => {
    const token = parseToken('d8=Q', 0);
    assert.deepStrictEqual(token, {type: 'symbol', value: 'd8=Q', start: 0, end: 4});
  });

  it('should parse the kingside castle symbol', () => {
    const token = parseToken('O-O', 0);
    assert.deepStrictEqual(token, {type: 'symbol', value: 'O-O', start: 0, end: 3});
  });

  it('should parse the queenside castle symbol', () => {
    const token = parseToken('O-O-O', 0);
    assert.deepStrictEqual(token, {type: 'symbol', value: 'O-O-O', start: 0, end: 5});
  });

  it('should parse the unknown termination', () => {
    const token = parseToken('*', 0);
    assert.deepStrictEqual(token, {type: 'gameTermination', value: '*', start: 0, end: 1});
  });

  it('should parse the white win termination', () => {
    const token = parseToken('1-0', 0);
    assert.deepStrictEqual(token, {type: 'gameTermination', value: '1-0', start: 0, end: 3});
  });

  it('should parse the black win termination', () => {
    const token = parseToken('0-1', 0);
    assert.deepStrictEqual(token, {type: 'gameTermination', value: '0-1', start: 0, end: 3});
  });

  it('should parse the draw termination', () => {
    const token = parseToken('1/2-1/2', 0);
    assert.deepStrictEqual(token, {type: 'gameTermination', value: '1/2-1/2', start: 0, end: 7});
  });

  it('should parse a single digit integer', () => {
    const token = parseToken('1', 0);
    assert.deepStrictEqual(token, {type: 'integer', value: 1, start: 0, end: 1});
  });

  it('should parse a multi-digit integer', () => {
    const token = parseToken('207', 0);
    assert.deepStrictEqual(token, {type: 'integer', value: 207, start: 0, end: 3});
  });

  it('should parse a comment', () => {
    const token = parseToken('{This is a comment}', 0);
    assert.deepStrictEqual(token, {type: 'comment', value: 'This is a comment', start: 0, end: 19});
  });

  it('should parse an unterminated comment', () => {
    const token = parseToken('{This is a comment', 0);
    assert.deepStrictEqual(token, {type: 'comment', value: 'This is a comment', start: 0, end: 18});
  });

  it('should skip white spaces', () => {
    const token = parseToken('   e4   ', 0);
    assert.deepStrictEqual(token, {type: 'symbol', value: 'e4', start: 3, end: 5});
  });

  it('should skip line returns', () => {
    const token = parseToken('\n\ne4', 0);
    assert.deepStrictEqual(token, {type: 'symbol', value: 'e4', start: 2, end: 4});
  });

  it('should throw if an invalid character is encountered', () => {
    assert.throws(() => {
      parseToken('@', 0);
    });
  });

  it('should throw if an invalid annotation is encountered', () => {
    assert.throws(() => {
      parseToken('+++', 0);
    });
  });
});
