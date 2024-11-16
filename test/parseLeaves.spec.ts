import * as assert from 'node:assert';
import {describe, it} from 'node:test';
import {parseLeaves} from '../src/parseLeaves';

describe('parseLeaves', () => {
  it('should parse an empty array', () => {
    const nodes = parseLeaves([]);
    assert.deepStrictEqual(nodes, []);
  });

  it('should parse a single tag pair', () => {
    const nodes = parseLeaves([
      {type: 'leftBracket', start: 0, end: 1},
      {type: 'symbol', value: 'Event', start: 1, end: 6},
      {type: 'string', value: 'F/S Return Match', start: 7, end: 25},
      {type: 'rightBracket', start: 25, end: 26}
    ]);
    assert.deepStrictEqual(nodes, [
      {
        type: 'tagPair',
        name: 'Event',
        value: 'F/S Return Match',
        start: 0,
        end: 26
      }
    ]);
  });

  it('should parse a half move', () => {
    const nodes = parseLeaves([{type: 'symbol', value: 'e4', start: 0, end: 2}]);
    assert.deepStrictEqual(nodes, [
      {
        type: 'halfMove',
        value: 'e4',
        start: 0,
        end: 2
      }
    ]);
  });

  it('should parse a half move with a move number', () => {
    const nodes = parseLeaves([
      {type: 'integer', value: 1, start: 0, end: 1},
      {type: 'period', start: 0, end: 2},
      {type: 'symbol', value: 'e4', start: 2, end: 4}
    ]);
    assert.deepStrictEqual(nodes, [
      {
        type: 'halfMove',
        value: 'e4',
        start: 0,
        end: 4
      }
    ]);
  });

  it('should parse a game termination', () => {
    const nodes = parseLeaves([{type: 'symbol', value: '1-0', start: 0, end: 3}]);
    assert.deepStrictEqual(nodes, [
      {
        type: 'gameTermination',
        value: '1-0',
        start: 0,
        end: 3
      }
    ]);
  });

  it('should parse a complex PGN', () => {
    const nodes = parseLeaves([
      {type: 'leftBracket', start: 0, end: 1},
      {type: 'symbol', value: 'Event', start: 1, end: 6},
      {type: 'string', value: 'F/S Return Match', start: 7, end: 25},
      {type: 'rightBracket', start: 25, end: 26},
      {type: 'integer', value: 1, start: 28, end: 29},
      {type: 'period', start: 29, end: 30},
      {type: 'symbol', value: 'e4', start: 31, end: 33},
      {type: 'symbol', value: 'e5', start: 34, end: 36},
      {type: 'asterisk', start: 37, end: 38}
    ]);

    assert.deepStrictEqual(nodes, [
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
        start: 34,
        end: 36
      },
      {
        type: 'gameTermination',
        value: '*',
        start: 37,
        end: 38
      }
    ]);
  });
});
