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
            type: 'move',
            number: 1,
            turn: 'white',
            value: 'e4',
            suffix: undefined,
            annotations: [],
            comments: [],
            variations: [],
            start: 27,
            end: 31
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
            start: 32,
            end: 34
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
            start: 35,
            end: 40
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
            start: 41,
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
            type: 'move',
            number: 1,
            turn: 'white',
            value: 'e4',
            suffix: undefined,
            annotations: [],
            comments: [],
            variations: [],
            start: 27,
            end: 31
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
            start: 32,
            end: 34
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
            start: 35,
            end: 40
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
            start: 41,
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

  it('should parse a game with an alternative starting position', () => {
    const result = parseGame(
      new Tokenizer(
        '[SetUp "1"][FEN "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"] 2...d6 *'
      )
    );
    assert.deepStrictEqual(result, {
      type: 'game',
      tagPairSection: {
        type: 'tagPairSection',
        tagPairs: [
          {
            type: 'tagPair',
            name: 'SetUp',
            value: '1',
            start: 0,
            end: 11
          },
          {
            type: 'tagPair',
            name: 'FEN',
            value: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
            start: 11,
            end: 81
          }
        ],
        start: 0,
        end: 81
      },
      moveTextSection: {
        type: 'moveTextSection',
        moves: [
          {
            type: 'move',
            number: 2,
            turn: 'black',
            value: 'd6',
            suffix: undefined,
            annotations: [],
            comments: [],
            variations: [],
            start: 82,
            end: 88
          }
        ],
        gameTermination: {
          type: 'gameTermination',
          value: '*',
          start: 89,
          end: 90
        },
        start: 82,
        end: 90
      },
      start: 0,
      end: 90
    });
  });
});
