import * as assert from 'node:assert';
import {describe, it} from 'node:test';
import {parseFile} from '../src/parseFile';
import {Tokenizer} from '../src/tokenizer';

describe('parseFile', () => {
  it('should parse an empty token stream', () => {
    const result = parseFile(new Tokenizer(''));
    assert.deepStrictEqual(result, {
      type: 'file',
      comments: [],
      games: [],
      start: 0,
      end: 0
    });
  });

  it('should parse a single game', () => {
    const result = parseFile(new Tokenizer('1.e4 e5 2.Nf3 Nc6 *'));
    assert.deepStrictEqual(result, {
      type: 'file',
      comments: [],
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
              },
              {
                type: 'move',
                number: 1,
                turn: 'black',
                value: 'e5',
                suffix: undefined,
                annotations: [],
                comments: [],
                variations: [],
                start: 5,
                end: 7
              },
              {
                type: 'move',
                number: 2,
                turn: 'white',
                value: 'Nf3',
                suffix: undefined,
                annotations: [],
                comments: [],
                variations: [],
                start: 8,
                end: 13
              },
              {
                type: 'move',
                number: 2,
                turn: 'black',
                value: 'Nc6',
                suffix: undefined,
                annotations: [],
                comments: [],
                variations: [],
                start: 14,
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
      comments: [],
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

  it('should parse a game with a comment', () => {
    const result = parseFile(new Tokenizer('1.e4 e5 * {The open game}'));
    assert.deepStrictEqual(result, {
      type: 'file',
      comments: [
        {
          type: 'comment',
          value: 'The open game',
          start: 10,
          end: 25
        }
      ],
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
              },
              {
                type: 'move',
                number: 1,
                turn: 'black',
                value: 'e5',
                suffix: undefined,
                annotations: [],
                comments: [],
                variations: [],
                start: 5,
                end: 7
              }
            ],
            gameTermination: {
              type: 'gameTermination',
              value: '*',
              start: 8,
              end: 9
            },
            start: 0,
            end: 9
          },
          start: 0,
          end: 9
        }
      ],
      start: 0,
      end: 9
    });
  });

  it('should throw if an unexpected token is encountered', () => {
    assert.throws(() => {
      parseFile(new Tokenizer('1.e4 e5 ]'));
    });
  });
});
