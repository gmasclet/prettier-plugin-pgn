import {MoveNode, VariationNode} from './astNode';
import {Tokenizer} from './tokenizer';
import {hasValue, noValue, repeat} from './utils';

export interface MoveContext {
  number: number;
  turn: 'white' | 'black';
}

export function parseMove(tokens: Tokenizer, context: MoveContext): MoveNode | undefined {
  const number = tokens.accept('integer');
  const periods = repeat(() => tokens.accept('period'));
  const move =
    hasValue(number) || periods.length > 0 ? tokens.expect('symbol') : tokens.accept('symbol');
  if (noValue(move)) {
    return undefined;
  }
  const comments = repeat(() => tokens.accept('comment'));
  const variations = repeat(() => parseVariation(tokens, {...context}));
  const node = {
    type: 'move',
    ...context,
    value: move.value,
    comments: comments,
    variations: variations,
    start: number ? number.start : [...periods, move][0].start,
    end: ([...comments, ...variations].pop() ?? move).end
  } as const;

  if (context.turn === 'white') {
    context.turn = 'black';
  } else {
    context.number++;
    context.turn = 'white';
  }

  return node;
}

function parseVariation(tokens: Tokenizer, context: MoveContext): VariationNode | undefined {
  const leftParenthesis = tokens.accept('leftParenthesis');
  if (noValue(leftParenthesis)) {
    return undefined;
  }

  const moves = repeat(() => parseMove(tokens, context));
  const rightParenthesis = tokens.expect('rightParenthesis');
  return {
    type: 'variation',
    moves: moves,
    start: leftParenthesis.start,
    end: rightParenthesis.end
  };
}
