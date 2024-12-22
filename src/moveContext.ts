import {Chess} from 'chess.js';
import {ParserError} from './parserError';
import {castToError} from './utils';

export class MoveContext {
  private readonly engine: Chess;

  constructor(fen?: string) {
    this.engine = new Chess(fen);
  }

  get number(): number {
    return this.engine.moveNumber();
  }

  get turn(): 'white' | 'black' {
    return this.engine.turn() === 'w' ? 'white' : 'black';
  }

  play(move: {value: string; start: number}): string {
    try {
      return this.engine.move(move.value, {strict: false}).san;
    } catch (e) {
      throw new ParserError(castToError(e).message, move);
    }
  }

  clone(): MoveContext {
    return new MoveContext(this.engine.fen());
  }
}
