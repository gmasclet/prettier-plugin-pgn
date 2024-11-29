import {HalfMoveNode, MoveNode} from './astNode';
import {Tokenizer} from './tokenizer';
import {hasValue, noValue, repeat} from './utils';

export function parseMove(tokens: Tokenizer, moveNumber: number): MoveNode | undefined {
  const white = parseHalfMove(tokens);
  if (noValue(white)) {
    return undefined;
  }
  const black = parseHalfMove(tokens);
  if (noValue(black)) {
    return {
      type: 'whiteMove',
      number: moveNumber,
      white: white,
      start: white.start,
      end: white.end
    };
  }
  return {
    type: 'fullMove',
    number: moveNumber,
    white: white,
    black: black,
    start: white.start,
    end: black.end
  };
}

function parseHalfMove(tokens: Tokenizer): HalfMoveNode | undefined {
  const number = tokens.accept('integer');
  const periods = repeat(() => tokens.accept('period'));
  const move =
    hasValue(number) || periods.length > 0 ? tokens.expect('symbol') : tokens.accept('symbol');
  if (noValue(move)) {
    return undefined;
  }
  return {
    type: 'halfMove',
    value: move.value,
    start: number ? number.start : [...periods, move][0].start,
    end: move.end
  };
}
