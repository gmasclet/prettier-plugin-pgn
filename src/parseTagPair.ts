import {TagPairNode} from './astNode';
import {Tokenizer} from './tokenizer';
import {noValue} from './utils';

export function parseTagPair(tokens: Tokenizer): TagPairNode | undefined {
  const leftBracket = tokens.accept('leftBracket');
  if (noValue(leftBracket)) {
    return undefined;
  }
  const name = tokens.expect('symbol');
  const value = tokens.expect('string');
  const rightBracket = tokens.accept('rightBracket');
  return {
    type: 'tagPair',
    name: name.value,
    value: value.value,
    start: leftBracket.start,
    end: (rightBracket ?? value).end
  };
}
