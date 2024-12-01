import * as assert from 'node:assert';
import {describe, it} from 'node:test';
import {parseMove} from '../src/parseMove';
import {Tokenizer} from '../src/tokenizer';

describe('parseMove', () => {
  it('should return undefined if there is no token', () => {
    const result = parseMove(new Tokenizer(''), {turn: 'white', number: 1});
    assert.strictEqual(result, undefined);
  });

  it('should return undefined if the first token is not a move token', () => {
    const result = parseMove(new Tokenizer('*'), {turn: 'white', number: 1});
    assert.strictEqual(result, undefined);
  });

  it('should parse a full move', () => {
    const result = parseMove(new Tokenizer('1.e4 e5'), {turn: 'white', number: 1});
    assert.deepStrictEqual(result, {
      type: 'fullMove',
      number: 1,
      white: {
        type: 'halfMove',
        value: 'e4',
        variations: [],
        start: 0,
        end: 4
      },
      black: {
        type: 'halfMove',
        value: 'e5',
        variations: [],
        start: 5,
        end: 7
      },
      start: 0,
      end: 7
    });
  });

  it('should parse a white move only', () => {
    const result = parseMove(new Tokenizer('1.Nf3'), {turn: 'white', number: 1});
    assert.deepStrictEqual(result, {
      type: 'whiteMove',
      number: 1,
      white: {
        type: 'halfMove',
        value: 'Nf3',
        variations: [],
        start: 0,
        end: 5
      },
      start: 0,
      end: 5
    });
  });

  it('should parse a move without a number', () => {
    const result = parseMove(new Tokenizer('Nf3'), {turn: 'white', number: 1});
    assert.deepStrictEqual(result, {
      type: 'whiteMove',
      number: 1,
      white: {
        type: 'halfMove',
        value: 'Nf3',
        variations: [],
        start: 0,
        end: 3
      },
      start: 0,
      end: 3
    });
  });

  it('should parse a move without a period', () => {
    const result = parseMove(new Tokenizer('1 Nf3'), {turn: 'white', number: 1});
    assert.deepStrictEqual(result, {
      type: 'whiteMove',
      number: 1,
      white: {
        type: 'halfMove',
        value: 'Nf3',
        variations: [],
        start: 0,
        end: 5
      },
      start: 0,
      end: 5
    });
  });

  it('should parse a move with several periods', () => {
    const result = parseMove(new Tokenizer('1...Nf3'), {turn: 'white', number: 1});
    assert.deepStrictEqual(result, {
      type: 'whiteMove',
      number: 1,
      white: {
        type: 'halfMove',
        value: 'Nf3',
        variations: [],
        start: 0,
        end: 7
      },
      start: 0,
      end: 7
    });
  });

  it('should parse a move with a white variation', () => {
    const result = parseMove(new Tokenizer('1.e4 (1.d4) 1...e5'), {turn: 'white', number: 1});
    assert.deepStrictEqual(result, {
      type: 'fullMove',
      number: 1,
      white: {
        type: 'halfMove',
        value: 'e4',
        variations: [
          {
            type: 'variation',
            moves: [
              {
                type: 'whiteMove',
                number: 1,
                white: {
                  type: 'halfMove',
                  value: 'd4',
                  variations: [],
                  start: 6,
                  end: 10
                },
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
      },
      black: {
        type: 'halfMove',
        value: 'e5',
        variations: [],
        start: 12,
        end: 18
      },
      start: 0,
      end: 18
    });
  });

  it('should parse a move with a black variation', () => {
    const result = parseMove(new Tokenizer('1.e4 e5 (1...d5)'), {turn: 'white', number: 1});
    assert.deepStrictEqual(result, {
      type: 'fullMove',
      number: 1,
      white: {
        type: 'halfMove',
        value: 'e4',
        variations: [],
        start: 0,
        end: 4
      },
      black: {
        type: 'halfMove',
        value: 'e5',
        variations: [
          {
            type: 'variation',
            moves: [
              {
                type: 'blackMove',
                number: 1,
                black: {
                  type: 'halfMove',
                  value: 'd5',
                  variations: [],
                  start: 9,
                  end: 15
                },
                start: 9,
                end: 15
              }
            ],
            start: 8,
            end: 16
          }
        ],
        start: 5,
        end: 16
      },
      start: 0,
      end: 16
    });
  });

  it('should parse a move with several variations', () => {
    const result = parseMove(new Tokenizer('1.e4 (1.d4) (1.c4) 1...e5'), {
      turn: 'white',
      number: 1
    });
    assert.deepStrictEqual(result, {
      type: 'fullMove',
      number: 1,
      white: {
        type: 'halfMove',
        value: 'e4',
        variations: [
          {
            type: 'variation',
            moves: [
              {
                type: 'whiteMove',
                number: 1,
                white: {
                  type: 'halfMove',
                  value: 'd4',
                  variations: [],
                  start: 6,
                  end: 10
                },
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
                type: 'whiteMove',
                number: 1,
                white: {
                  type: 'halfMove',
                  value: 'c4',
                  variations: [],
                  start: 13,
                  end: 17
                },
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
      },
      black: {
        type: 'halfMove',
        value: 'e5',
        variations: [],
        start: 19,
        end: 25
      },
      start: 0,
      end: 25
    });
  });

  it('should parse a move with nested variations', () => {
    const result = parseMove(new Tokenizer('1.e4 (1.d4 d5 (1...Nf6)) 1...e5'), {
      turn: 'white',
      number: 1
    });
    assert.deepStrictEqual(result, {
      type: 'fullMove',
      number: 1,
      white: {
        type: 'halfMove',
        value: 'e4',
        variations: [
          {
            type: 'variation',
            moves: [
              {
                type: 'fullMove',
                number: 1,
                white: {
                  type: 'halfMove',
                  value: 'd4',
                  variations: [],
                  start: 6,
                  end: 10
                },
                black: {
                  type: 'halfMove',
                  value: 'd5',
                  variations: [
                    {
                      type: 'variation',
                      moves: [
                        {
                          type: 'blackMove',
                          number: 1,
                          black: {
                            type: 'halfMove',
                            value: 'Nf6',
                            variations: [],
                            start: 15,
                            end: 22
                          },
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
                },
                start: 6,
                end: 23
              }
            ],
            start: 5,
            end: 24
          }
        ],
        start: 0,
        end: 24
      },
      black: {
        type: 'halfMove',
        value: 'e5',
        variations: [],
        start: 25,
        end: 31
      },
      start: 0,
      end: 31
    });
  });

  it('should throw if an unfinished variation is encountered', () => {
    assert.throws(() => {
      parseMove(new Tokenizer('1.e4 (1.d4'), {turn: 'white', number: 1});
    });
  });

  it('should throw if a non-closed variation is encountered', () => {
    assert.throws(() => {
      parseMove(new Tokenizer('1.e4 (1.d4 (1.Nf3'), {turn: 'white', number: 1});
    });
  });

  it('should throw if a number without a move is encountered', () => {
    assert.throws(() => {
      parseMove(new Tokenizer('42'), {turn: 'white', number: 1});
    });
  });

  it('should throw if an unexpected token is encountered', () => {
    assert.throws(() => {
      parseMove(new Tokenizer('42...*'), {turn: 'white', number: 1});
    });
  });
});
