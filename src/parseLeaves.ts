import {LeafNode} from './astNode';
import {ParserError} from './parserError';
import {AsteriskToken, SymbolToken, Token} from './token';

export function parseLeaves(tokens: Token[]): LeafNode[] {
  const nodes: LeafNode[] = [];
  let index = 0;
  while (index < tokens.length) {
    const {node, length} = parseLeaf(tokens, index);
    nodes.push(node);
    index += length;
  }
  return nodes;
}

function parseLeaf(tokens: Token[], index: number): {node: LeafNode; length: number} {
  const token = tokens[index];
  switch (token.type) {
    case 'leftBracket':
      return parseTagPair(tokens, index);

    case 'integer':
      return parseNumberedMove(tokens, index);

    case 'asterisk':
    case 'symbol':
      return parseSingleTokenNode(token);

    default:
      throw new ParserError(`Unexpected token type "${token.type}"`, token);
  }
}

function parseTagPair(tokens: Token[], index: number): {node: LeafNode; length: number} {
  if (tokens.length < index + 2) {
    throw new ParserError('Unexpected partial tag pair', tokens[index]);
  }
  const name = tokens[index + 1];
  if (name.type !== 'symbol') {
    throw new ParserError(`Unexpected token ${name.type}, was expecting a symbol`, name);
  }
  const value = tokens[index + 2];
  if (value.type !== 'string') {
    throw new ParserError(`Unexpected token ${value.type}, was expecting a string`, value);
  }
  const hasRightBracket = tokens.length > index + 3 && tokens[index + 3].type === 'rightBracket';
  const lastToken = hasRightBracket ? tokens[index + 3] : value;
  return {
    node: {
      type: 'tagPair',
      name: name.value,
      value: value.value,
      start: tokens[index].start,
      end: lastToken.end
    },
    length: hasRightBracket ? 4 : 3
  };
}

function parseNumberedMove(tokens: Token[], startIndex: number): {node: LeafNode; length: number} {
  const number = tokens[startIndex];
  let index = startIndex + 1;
  while (index < tokens.length && tokens[index].type === 'period') {
    index++;
  }
  if (index >= tokens.length) {
    throw new ParserError('Unexpected partial move number', number);
  }
  const move = tokens[index];
  if (move.type !== 'symbol' || isGameTermination(move)) {
    throw new ParserError(`Unexpected token ${move.type}, was expecting a symbol`, move);
  }
  return {
    node: {
      type: 'halfMove',
      value: move.value,
      start: number.start,
      end: move.end
    },
    length: index + 1 - startIndex
  };
}

function parseSingleTokenNode(token: AsteriskToken | SymbolToken): {
  node: LeafNode;
  length: number;
} {
  return {
    node: {
      type: isGameTermination(token) ? 'gameTermination' : 'halfMove',
      value: token.type === 'symbol' ? token.value : '*',
      start: token.start,
      end: token.end
    },
    length: 1
  };
}

function isGameTermination(token: Token) {
  return (
    token.type === 'asterisk' ||
    (token.type === 'symbol' && ['1-0', '0-1', '1/2-1/2'].includes(token.value))
  );
}
