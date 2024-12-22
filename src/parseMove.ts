import {AnnotationNode, CommentNode, MoveNode, VariationNode} from './astNode';
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

  const comments: CommentNode[] = [];
  const annotations: AnnotationNode[] = [];
  for (;;) {
    const comment = tokens.accept('comment');
    if (hasValue(comment)) {
      comments.push(comment);
      continue;
    }
    const annotation = tokens.accept('annotation');
    if (hasValue(annotation)) {
      annotations.push(annotation);
      continue;
    }
    break;
  }

  const variations = repeat(() => parseVariation(tokens, {...context}));
  const node = {
    type: 'move',
    ...context,
    value: move.value,
    suffix: annotations.find((annotation) => isSuffix(annotation)),
    annotations: annotations.filter((annotation) => !isSuffix(annotation)),
    comments: comments,
    variations: variations,
    start: number ? number.start : [...periods, move][0].start,
    end: (
      [...[...annotations, ...comments].sort((a, b) => a.end - b.end), ...variations].pop() ?? move
    ).end
  } as const;

  if (context.turn === 'white') {
    context.turn = 'black';
  } else {
    context.number++;
    context.turn = 'white';
  }

  return node;
}

function isSuffix(annotation: AnnotationNode): boolean {
  return ['!', '?', '!!', '??', '!?', '?!'].includes(annotation.value);
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
