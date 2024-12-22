import * as assert from 'node:assert';
import {describe, it} from 'node:test';
import {parseMove} from '../src/parseMove';
import {Tokenizer} from '../src/tokenizer';

describe('parseMove', () => {
  it('should return undefined if there is no token', () => {
    const result = parseMove(new Tokenizer(''), {number: 1, turn: 'white'});
    assert.strictEqual(result, undefined);
  });

  it('should return undefined if the first token is not a move token', () => {
    const result = parseMove(new Tokenizer('*'), {number: 1, turn: 'white'});
    assert.strictEqual(result, undefined);
  });

  it('should parse a white move', () => {
    const result = parseMove(new Tokenizer('1.e4'), {number: 1, turn: 'white'});
    assert.deepStrictEqual(result, {
      type: 'move',
      number: 1,
      turn: 'white',
      value: 'e4',
      suffix: undefined,
      annotations: [],
      comments: [],
      variations: [],
      start: 0,
      end: 4
    });
  });

  it('should parse a black move', () => {
    const result = parseMove(new Tokenizer('1...e5'), {number: 1, turn: 'black'});
    assert.deepStrictEqual(result, {
      type: 'move',
      number: 1,
      turn: 'black',
      value: 'e5',
      suffix: undefined,
      annotations: [],
      comments: [],
      variations: [],
      start: 0,
      end: 6
    });
  });

  it('should parse a move without a number', () => {
    const result = parseMove(new Tokenizer('Nf3'), {number: 1, turn: 'white'});
    assert.deepStrictEqual(result, {
      type: 'move',
      number: 1,
      turn: 'white',
      value: 'Nf3',
      suffix: undefined,
      annotations: [],
      comments: [],
      variations: [],
      start: 0,
      end: 3
    });
  });

  it('should parse a move without a period', () => {
    const result = parseMove(new Tokenizer('1 Nf3'), {number: 1, turn: 'white'});
    assert.deepStrictEqual(result, {
      type: 'move',
      number: 1,
      turn: 'white',
      value: 'Nf3',
      suffix: undefined,
      annotations: [],
      comments: [],
      variations: [],
      start: 0,
      end: 5
    });
  });

  it('should parse a move with annotations', () => {
    const result = parseMove(new Tokenizer('1.Nf3! +/-'), {number: 1, turn: 'white'});
    assert.deepStrictEqual(result, {
      type: 'move',
      number: 1,
      turn: 'white',
      value: 'Nf3',
      suffix: {
        type: 'annotation',
        value: '!',
        start: 5,
        end: 6
      },
      annotations: [
        {
          type: 'annotation',
          value: '+/-',
          start: 7,
          end: 10
        }
      ],
      comments: [],
      variations: [],
      start: 0,
      end: 10
    });
  });

  it('should ignore redundant suffix annotations', () => {
    const result = parseMove(new Tokenizer('1.Nf3!!!!'), {number: 1, turn: 'white'});
    assert.deepStrictEqual(result, {
      type: 'move',
      number: 1,
      turn: 'white',
      value: 'Nf3',
      suffix: {
        type: 'annotation',
        value: '!!',
        start: 5,
        end: 7
      },
      annotations: [],
      comments: [],
      variations: [],
      start: 0,
      end: 9
    });
  });

  it('should parse a move with comments', () => {
    const result = parseMove(new Tokenizer('1.e4 {A comment} {Another comment}'), {
      number: 1,
      turn: 'white'
    });
    assert.deepStrictEqual(result, {
      type: 'move',
      number: 1,
      turn: 'white',
      value: 'e4',
      suffix: undefined,
      annotations: [],
      comments: [
        {
          type: 'comment',
          value: 'A comment',
          start: 5,
          end: 16
        },
        {
          type: 'comment',
          value: 'Another comment',
          start: 17,
          end: 34
        }
      ],
      variations: [],
      start: 0,
      end: 34
    });
  });

  it('should parse a move with annotations and comments', () => {
    const result = parseMove(new Tokenizer('1.e4! {A comment} ~ {Another comment}'), {
      number: 1,
      turn: 'white'
    });
    assert.deepStrictEqual(result, {
      type: 'move',
      number: 1,
      turn: 'white',
      value: 'e4',
      suffix: {
        type: 'annotation',
        value: '!',
        start: 4,
        end: 5
      },
      annotations: [
        {
          type: 'annotation',
          value: '~',
          start: 18,
          end: 19
        }
      ],
      comments: [
        {
          type: 'comment',
          value: 'A comment',
          start: 6,
          end: 17
        },
        {
          type: 'comment',
          value: 'Another comment',
          start: 20,
          end: 37
        }
      ],
      variations: [],
      start: 0,
      end: 37
    });
  });

  it('should parse a move with a variation', () => {
    const result = parseMove(new Tokenizer('1.e4 (1.d4)'), {number: 1, turn: 'white'});
    assert.deepStrictEqual(result, {
      type: 'move',
      number: 1,
      turn: 'white',
      value: 'e4',
      suffix: undefined,
      annotations: [],
      comments: [],
      variations: [
        {
          type: 'variation',
          moves: [
            {
              type: 'move',
              number: 1,
              turn: 'white',
              value: 'd4',
              suffix: undefined,
              annotations: [],
              comments: [],
              variations: [],
              start: 6,
              end: 10
            }
          ],
          start: 5,
          end: 11
        }
      ],
      start: 0,
      end: 11
    });
  });

  it('should parse a move with several variations', () => {
    const result = parseMove(new Tokenizer('1.e4 (1.d4) (1.c4)'), {
      number: 1,
      turn: 'white'
    });
    assert.deepStrictEqual(result, {
      type: 'move',
      number: 1,
      turn: 'white',
      value: 'e4',
      suffix: undefined,
      annotations: [],
      comments: [],
      variations: [
        {
          type: 'variation',
          moves: [
            {
              type: 'move',
              number: 1,
              turn: 'white',
              value: 'd4',
              suffix: undefined,
              annotations: [],
              comments: [],
              variations: [],
              start: 6,
              end: 10
            }
          ],
          start: 5,
          end: 11
        },
        {
          type: 'variation',
          moves: [
            {
              type: 'move',
              number: 1,
              turn: 'white',
              value: 'c4',
              suffix: undefined,
              annotations: [],
              comments: [],
              variations: [],
              start: 13,
              end: 17
            }
          ],
          start: 12,
          end: 18
        }
      ],
      start: 0,
      end: 18
    });
  });

  it('should parse a move with nested variations', () => {
    const result = parseMove(new Tokenizer('1.e4 (1.d4 d5 (1...Nf6))'), {
      number: 1,
      turn: 'white'
    });
    assert.deepStrictEqual(result, {
      type: 'move',
      number: 1,
      turn: 'white',
      value: 'e4',
      suffix: undefined,
      annotations: [],
      comments: [],
      variations: [
        {
          type: 'variation',
          moves: [
            {
              type: 'move',
              number: 1,
              turn: 'white',
              value: 'd4',
              suffix: undefined,
              annotations: [],
              comments: [],
              variations: [],
              start: 6,
              end: 10
            },
            {
              type: 'move',
              number: 1,
              turn: 'black',
              value: 'd5',
              suffix: undefined,
              annotations: [],
              comments: [],
              variations: [
                {
                  type: 'variation',
                  moves: [
                    {
                      type: 'move',
                      number: 1,
                      turn: 'black',
                      value: 'Nf6',
                      suffix: undefined,
                      annotations: [],
                      comments: [],
                      variations: [],
                      start: 15,
                      end: 22
                    }
                  ],
                  start: 14,
                  end: 23
                }
              ],
              start: 11,
              end: 23
            }
          ],
          start: 5,
          end: 24
        }
      ],
      start: 0,
      end: 24
    });
  });

  it('should throw if an unfinished variation is encountered', () => {
    assert.throws(() => {
      parseMove(new Tokenizer('1.e4 (1.d4'), {number: 1, turn: 'white'});
    });
  });

  it('should throw if a non-closed variation is encountered', () => {
    assert.throws(() => {
      parseMove(new Tokenizer('1.e4 (1.d4 (1.Nf3'), {number: 1, turn: 'white'});
    });
  });

  it('should throw if a number without a move is encountered', () => {
    assert.throws(() => {
      parseMove(new Tokenizer('42'), {number: 1, turn: 'white'});
    });
  });

  it('should throw if an unexpected token is encountered', () => {
    assert.throws(() => {
      parseMove(new Tokenizer('42...*'), {number: 1, turn: 'white'});
    });
  });
});
