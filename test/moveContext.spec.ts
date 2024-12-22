import * as assert from 'node:assert';
import {describe, it} from 'node:test';
import {MoveContext} from '../src/moveContext';

describe('MoveContext', () => {
  it('should initialize with the default position', () => {
    const context = new MoveContext();
    assert.strictEqual(context.number, 1);
    assert.strictEqual(context.turn, 'white');
  });

  it('should initialize with a given FEN string', () => {
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const context = new MoveContext(fen);
    assert.strictEqual(context.number, 1);
    assert.strictEqual(context.turn, 'white');
  });

  it('should play a move and return the SAN', () => {
    const context = new MoveContext();
    const san = context.play({value: 'e4', start: 0});
    assert.strictEqual(san, 'e4');
    assert.strictEqual(context.number, 1);
    assert.strictEqual(context.turn, 'black');
  });

  it('should maintain independent states between original and clone', () => {
    const context = new MoveContext();
    context.play({value: 'e4', start: 0});

    const clone = context.clone();
    clone.play({value: 'e5', start: 3});

    assert.strictEqual(context.number, 1);
    assert.strictEqual(context.turn, 'black');
    assert.strictEqual(clone.number, 2);
    assert.strictEqual(clone.turn, 'white');
  });

  it('should fix non standard moves', () => {
    const san = new MoveContext().play({value: 'e2-e4', start: 0});
    assert.strictEqual(san, 'e4');
  });

  it('should throw if an invalid move is played', () => {
    assert.throws(() => {
      new MoveContext().play({value: 'e5', start: 0});
    });
  });
});
