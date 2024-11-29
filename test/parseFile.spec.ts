import * as assert from 'node:assert';
import {describe, it} from 'node:test';
import {parseFile} from '../src/parseFile';
import {Tokenizer} from '../src/tokenizer';

describe('parseFile', () => {
  it('should parse an empty token stream', () => {
    const result = parseFile(new Tokenizer(''));
    assert.deepStrictEqual(result, {
      type: 'file',
      games: [],
      start: 0,
      end: 0
    });
  });

  it('should parse a single game', () => {
    const result = parseFile(new Tokenizer('1.e4 e5 2.Nf3 Nc6 *'));
    assert.deepStrictEqual(result, {
      type: 'file',
      games: [
        {
          type: 'game',
          tagPairSection: {
            type: 'tagPairSection',
            tagPairs: [],
            start: 0,
            end: 0
          },
          moveTextSection: {
            type: 'moveTextSection',
            moves: [
              {
                type: 'fullMove',
                number: 1,
                white: {type: 'halfMove', value: 'e4', start: 0, end: 4},
                black: {type: 'halfMove', value: 'e5', start: 5, end: 7},
                start: 0,
                end: 7
              },
              {
                type: 'fullMove',
                number: 2,
                white: {type: 'halfMove', value: 'Nf3', start: 8, end: 13},
                black: {type: 'halfMove', value: 'Nc6', start: 14, end: 17},
                start: 8,
                end: 17
              }
            ],
            gameTermination: {
              type: 'gameTermination',
              value: '*',
              start: 18,
              end: 19
            },
            start: 0,
            end: 19
          },
          start: 0,
          end: 19
        }
      ],
      start: 0,
      end: 19
    });
  });

  it('should parse multiple games', () => {
    const result = parseFile(new Tokenizer('* * *'));
    assert.deepStrictEqual(result, {
      type: 'file',
      games: [
        {
          type: 'game',
          tagPairSection: {
            type: 'tagPairSection',
            tagPairs: [],
            start: 0,
            end: 0
          },
          moveTextSection: {
            type: 'moveTextSection',
            moves: [],
            gameTermination: {
              type: 'gameTermination',
              value: '*',
              start: 0,
              end: 1
            },
            start: 0,
            end: 1
          },
          start: 0,
          end: 1
        },
        {
          type: 'game',
          tagPairSection: {
            type: 'tagPairSection',
            tagPairs: [],
            start: 2,
            end: 2
          },
          moveTextSection: {
            type: 'moveTextSection',
            moves: [],
            gameTermination: {
              type: 'gameTermination',
              value: '*',
              start: 2,
              end: 3
            },
            start: 2,
            end: 3
          },
          start: 2,
          end: 3
        },
        {
          type: 'game',
          tagPairSection: {
            type: 'tagPairSection',
            tagPairs: [],
            start: 4,
            end: 4
          },
          moveTextSection: {
            type: 'moveTextSection',
            moves: [],
            gameTermination: {
              type: 'gameTermination',
              value: '*',
              start: 4,
              end: 5
            },
            start: 4,
            end: 5
          },
          start: 4,
          end: 5
        }
      ],
      start: 0,
      end: 5
    });
  });

  it('should throw if an unexpected token is encountered', () => {
    assert.throws(() => {
      parseFile(new Tokenizer('1.e4 e5 ]'));
    });
  });
});
