import {HalfMoveNode, MoveNode, VariationNode} from './astNode';
import {Tokenizer} from './tokenizer';
import {hasValue, noValue, repeat} from './utils';

export interface MoveContext {
  turn: 'white' | 'black';
  number: number;
}

export function parseMove(tokens: Tokenizer, context: MoveContext): MoveNode | undefined {
  const firstHalfMove = parseHalfMove(tokens, context);
  if (noValue(firstHalfMove)) {
    return undefined;
  }

  if (context.turn === 'black') {
    return {
      type: 'blackMove',
      number: context.number,
      black: firstHalfMove,
      start: firstHalfMove.start,
      end: firstHalfMove.end
    };
  }

  const secondHalfMove = parseHalfMove(tokens, {...context, turn: 'black'});
  if (noValue(secondHalfMove)) {
    return {
      type: 'whiteMove',
      number: context.number,
      white: firstHalfMove,
      start: firstHalfMove.start,
      end: firstHalfMove.end
    };
  }

  return {
    type: 'fullMove',
    number: context.number,
    white: firstHalfMove,
    black: secondHalfMove,
    start: firstHalfMove.start,
    end: secondHalfMove.end
  };
}

function parseHalfMove(tokens: Tokenizer, context: MoveContext): HalfMoveNode | undefined {
  const number = tokens.accept('integer');
  const periods = repeat(() => tokens.accept('period'));
  const move =
    hasValue(number) || periods.length > 0 ? tokens.expect('symbol') : tokens.accept('symbol');
  if (noValue(move)) {
    return undefined;
  }
  const variations = repeat(() => parseVariation(tokens, context));
  return {
    type: 'halfMove',
    value: move.value,
    variations: variations,
    start: number ? number.start : [...periods, move][0].start,
    end: variations.length > 0 ? variations[variations.length - 1].end : move.end
  };
}

function parseVariation(tokens: Tokenizer, context: MoveContext): VariationNode | undefined {
  const leftParenthesis = tokens.accept('leftParenthesis');
  if (noValue(leftParenthesis)) {
    return undefined;
  }

  const variationContext = {...context};
  const moves = repeat(() => {
    const move = parseMove(tokens, variationContext);
    variationContext.number++;
    variationContext.turn = 'white';
    return move;
  });

  const rightParenthesis = tokens.expect('rightParenthesis');
  return {
    type: 'variation',
    moves: moves,
    start: leftParenthesis.start,
    end: rightParenthesis.end
  };
}
