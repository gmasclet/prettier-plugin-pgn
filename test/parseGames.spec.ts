import * as assert from 'node:assert';
import {describe, it} from 'node:test';
import {parseGames} from '../src/parseGames';

describe('GameParser', () => {
  it('should parse an empty array', () => {
    const sections = parseGames([]);
    assert.deepStrictEqual(sections, []);
  });

  it('should parse a single move text section', () => {
    const result = parseGames([
      {
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
      }
    ]);

    assert.deepStrictEqual(result, [
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
      }
    ]);
  });

  it('should parse a tag pair section without a following move text section', () => {
    const result = parseGames([
      {
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
      }
    ]);

    assert.deepStrictEqual(result, [
      {
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
          moves: [],
          gameTermination: {
            type: 'gameTermination',
            value: '*',
            start: 26,
            end: 26
          },
          start: 26,
          end: 26
        },
        start: 0,
        end: 26
      }
    ]);
  });

  it('should parse a tag pair section followed by a move text section', () => {
    const result = parseGames([
      {
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
      {
        type: 'moveTextSection',
        moves: [],
        gameTermination: {
          type: 'gameTermination',
          value: '*',
          start: 27,
          end: 28
        },
        start: 27,
        end: 28
      }
    ]);

    assert.deepStrictEqual(result, [
      {
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
          moves: [],
          gameTermination: {
            type: 'gameTermination',
            value: '*',
            start: 27,
            end: 28
          },
          start: 27,
          end: 28
        },
        start: 0,
        end: 28
      }
    ]);
  });
});
