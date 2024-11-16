import * as assert from 'node:assert';
import {describe, it} from 'node:test';
import {parseSections} from '../src/parseSections';

describe('parseSections', () => {
  it('should parse an empty array', () => {
    const sections = parseSections([]);
    assert.deepStrictEqual(sections, []);
  });

  it('should parse a tag pair section', () => {
    const sections = parseSections([
      {
        type: 'tagPair',
        name: 'Event',
        value: 'F/S Return Match',
        start: 0,
        end: 26
      },
      {
        type: 'tagPair',
        name: 'Site',
        value: 'Belgrade, Serbia JUG',
        start: 26,
        end: 55
      },
      {
        type: 'tagPair',
        name: 'Date',
        value: '1992.11.04',
        start: 55,
        end: 74
      }
    ]);

    assert.deepStrictEqual(sections, [
      {
        type: 'tagPairSection',
        tagPairs: [
          {
            type: 'tagPair',
            name: 'Event',
            value: 'F/S Return Match',
            start: 0,
            end: 26
          },
          {
            type: 'tagPair',
            name: 'Site',
            value: 'Belgrade, Serbia JUG',
            start: 26,
            end: 55
          },
          {
            type: 'tagPair',
            name: 'Date',
            value: '1992.11.04',
            start: 55,
            end: 74
          }
        ],
        start: 0,
        end: 74
      }
    ]);
  });

  it('should parse a move text section', () => {
    const sections = parseSections([
      {
        type: 'halfMove',
        value: 'e4',
        start: 0,
        end: 5
      },
      {
        type: 'halfMove',
        value: 'e5',
        start: 5,
        end: 7
      },
      {
        type: 'gameTermination',
        start: 8,
        end: 11,
        value: '1-0'
      }
    ]);

    assert.deepStrictEqual(sections, [
      {
        type: 'moveTextSection',
        moves: [
          {
            type: 'fullMove',
            number: 1,
            white: {
              type: 'halfMove',
              value: 'e4',
              start: 0,
              end: 5
            },
            black: {
              type: 'halfMove',
              value: 'e5',
              start: 5,
              end: 7
            },
            start: 0,
            end: 7
          }
        ],
        gameTermination: {
          type: 'gameTermination',
          value: '1-0',
          start: 8,
          end: 11
        },
        start: 0,
        end: 11
      }
    ]);
  });

  it('should parse a move text section without game termination', () => {
    const sections = parseSections([
      {
        type: 'halfMove',
        value: 'e4',
        start: 0,
        end: 5
      },
      {
        type: 'halfMove',
        value: 'e5',
        start: 5,
        end: 7
      }
    ]);

    assert.deepStrictEqual(sections, [
      {
        type: 'moveTextSection',
        moves: [
          {
            type: 'fullMove',
            number: 1,
            white: {
              type: 'halfMove',
              value: 'e4',
              start: 0,
              end: 5
            },
            black: {
              type: 'halfMove',
              value: 'e5',
              start: 5,
              end: 7
            },
            start: 0,
            end: 7
          }
        ],
        gameTermination: {
          type: 'gameTermination',
          value: '*',
          start: 7,
          end: 7
        },
        start: 0,
        end: 7
      }
    ]);
  });

  it('should parse a move text section without moves', () => {
    const sections = parseSections([
      {
        type: 'gameTermination',
        start: 0,
        end: 3,
        value: '1-0'
      }
    ]);

    assert.deepStrictEqual(sections, [
      {
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
      }
    ]);
  });

  it('should parse mixed sections', () => {
    const sections = parseSections([
      {
        type: 'tagPair',
        name: 'Event',
        value: 'F/S Return Match',
        start: 0,
        end: 26
      },
      {
        type: 'halfMove',
        value: 'e4',
        start: 28,
        end: 33
      },
      {
        type: 'halfMove',
        value: 'e5',
        start: 35,
        end: 37
      },
      {
        type: 'gameTermination',
        start: 38,
        end: 41,
        value: '1-0'
      }
    ]);

    assert.deepStrictEqual(sections, [
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
        moves: [
          {
            type: 'fullMove',
            number: 1,
            white: {
              type: 'halfMove',
              value: 'e4',
              start: 28,
              end: 33
            },
            black: {
              type: 'halfMove',
              value: 'e5',
              start: 35,
              end: 37
            },
            start: 28,
            end: 37
          }
        ],
        gameTermination: {
          type: 'gameTermination',
          value: '1-0',
          start: 38,
          end: 41
        },
        start: 28,
        end: 41
      }
    ]);
  });
});
