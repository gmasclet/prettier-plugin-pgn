import {Chess} from 'chess.js';
import {ParserError} from './parserError';
import {castToError} from './utils';

/**
 * Handle the state of a chess game and validate moves.
 *
 * Accept a FEN string at construction, to support non-standard starting positions.
 */
export class MoveContext {
  private readonly engine: Chess;

  constructor(fen?: string) {
    this.engine = new Chess(fen);
  }

  /**
   * Get the current move number.
   */
  get number(): number {
    return this.engine.moveNumber();
  }

  /**
   * Get which side is the current turn to move.
   */
  get turn(): 'white' | 'black' {
    return this.engine.turn() === 'w' ? 'white' : 'black';
  }

  /**
   * Play a move and update the state accordingly. Return the SAN (Standard Algebraic Notation)
   * representation of the move. Throw if the move is invalid or illegal for the current position.
   */
  play(move: {value: string; start: number}): string {
    try {
      return this.engine.move(move.value, {strict: false}).san;
    } catch (e) {
      throw new ParserError(castToError(e).message, move);
    }
  }

  /**
   * Create a clone of the current instance. Useful to handle variations without affecting the
   * main line.
   */
  clone(): MoveContext {
    return new MoveContext(this.engine.fen());
  }
}
