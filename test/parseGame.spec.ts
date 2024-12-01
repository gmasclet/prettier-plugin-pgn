import * as assert from 'node:assert';
import {describe, it} from 'node:test';
import {parseGame} from '../src/parseGame';
import {Tokenizer} from '../src/tokenizer';

describe('parseGame', () => {
  it('should return undefined if there is no token', () => {
    const result = parseGame(new Tokenizer(''));
    assert.strictEqual(result, undefined);
  });

  it('should return undefined if the first token is invalid', () => {
    const result = parseGame(new Tokenizer(']'));
    assert.strictEqual(result, undefined);
  });

  it('should parse a game with only tag pairs', () => {
    const result = parseGame(
      new Tokenizer('[Event "F/S Return Match"][Site "Belgrade, Serbia JUG"][Date "1992.11.04"]')
    );

    assert.deepStrictEqual(result, {
      type: 'game',
      tagPairSection: {
        type: 'tagPairSection',
        tagPairs: [
          {type: 'tagPair', name: 'Event', value: 'F/S Return Match', start: 0, end: 26},
          {type: 'tagPair', name: 'Site', value: 'Belgrade, Serbia JUG', start: 26, end: 55},
          {type: 'tagPair', name: 'Date', value: '1992.11.04', start: 55, end: 74}
        ],
        start: 0,
        end: 74
      },
      moveTextSection: {
        type: 'moveTextSection',
        moves: [],
        gameTermination: {
          type: 'gameTermination',
          value: '*',
          start: 74,
          end: 74
        },
        start: 74,
        end: 74
      },
      start: 0,
      end: 74
    });
  });

  it('should parse a game with only moves', () => {
    const result = parseGame(new Tokenizer('1.e4 e5 2.Nf3 Nc6'));
    assert.deepStrictEqual(result, {
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
            white: {type: 'halfMove', value: 'e4', variations: [], start: 0, end: 4},
            black: {type: 'halfMove', value: 'e5', variations: [], start: 5, end: 7},
            start: 0,
            end: 7
          },
          {
            type: 'fullMove',
            number: 2,
            white: {type: 'halfMove', value: 'Nf3', variations: [], start: 8, end: 13},
            black: {type: 'halfMove', value: 'Nc6', variations: [], start: 14, end: 17},
            start: 8,
            end: 17
          }
        ],
        gameTermination: {
          type: 'gameTermination',
          value: '*',
          start: 17,
          end: 17
        },
        start: 0,
        end: 17
      },
      start: 0,
      end: 17
    });
  });

  it('should parse a game with only a move termination', () => {
    const result = parseGame(new Tokenizer('1-0'));
    assert.deepStrictEqual(result, {
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
          value: '1-0',
          start: 0,
          end: 3
        },
        start: 0,
        end: 3
      },
      start: 0,
      end: 3
    });
  });

  it('should parse a game with tag pairs and moves', () => {
    const result = parseGame(new Tokenizer('[Event "F/S Return Match"] 1.e4 e5 2.Nf3 Nc6'));
    assert.deepStrictEqual(result, {
      type: 'game',
      tagPairSection: {
        type: 'tagPairSection',
        tagPairs: [
          {
            type: 'tagPair',
            name: 'Event',
            value: 'F/S Return Match',
            start: 0,
            end: 26
          }
        ],
        start: 0,
        end: 26
      },
      moveTextSection: {
        type: 'moveTextSection',
        moves: [
          {
            type: 'fullMove',
            number: 1,
            white: {type: 'halfMove', value: 'e4', variations: [], start: 27, end: 31},
            black: {type: 'halfMove', value: 'e5', variations: [], start: 32, end: 34},
            start: 27,
            end: 34
          },
          {
            type: 'fullMove',
            number: 2,
            white: {type: 'halfMove', value: 'Nf3', variations: [], start: 35, end: 40},
            black: {type: 'halfMove', value: 'Nc6', variations: [], start: 41, end: 44},
            start: 35,
            end: 44
          }
        ],
        gameTermination: {
          type: 'gameTermination',
          value: '*',
          start: 44,
          end: 44
        },
        start: 27,
        end: 44
      },
      start: 0,
      end: 44
    });
  });

  it('should parse a complete game', () => {
    const result = parseGame(new Tokenizer('[Event "F/S Return Match"] 1.e4 e5 2.Nf3 Nc6 *'));
    assert.deepStrictEqual(result, {
      type: 'game',
      tagPairSection: {
        type: 'tagPairSection',
        tagPairs: [
          {
            type: 'tagPair',
            name: 'Event',
            value: 'F/S Return Match',
            start: 0,
            end: 26
          }
        ],
        start: 0,
        end: 26
      },
      moveTextSection: {
        type: 'moveTextSection',
        moves: [
          {
            type: 'fullMove',
            number: 1,
            white: {type: 'halfMove', value: 'e4', variations: [], start: 27, end: 31},
            black: {type: 'halfMove', value: 'e5', variations: [], start: 32, end: 34},
            start: 27,
            end: 34
          },
          {
            type: 'fullMove',
            number: 2,
            white: {type: 'halfMove', value: 'Nf3', variations: [], start: 35, end: 40},
            black: {type: 'halfMove', value: 'Nc6', variations: [], start: 41, end: 44},
            start: 35,
            end: 44
          }
        ],
        gameTermination: {
          type: 'gameTermination',
          value: '*',
          start: 45,
          end: 46
        },
        start: 27,
        end: 46
      },
      start: 0,
      end: 46
    });
  });
});
