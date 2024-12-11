import {ParserError} from './parserError';
import {Token, TokenType} from './token';

export function parseToken(text: string, index: number): Token | undefined {
  while (index < text.length && isWhitespace(text[index])) {
    index++;
  }
  if (index >= text.length) {
    return undefined;
  }
  const type = findTokenType(text, index);
  switch (type) {
    case 'period':
    case 'leftBracket':
    case 'rightBracket':
    case 'leftParenthesis':
    case 'rightParenthesis':
      return {
        type: type,
        start: index,
        end: index + 1
      };

    case 'comment':
      return parseComment(text, index);

    case 'string':
      return parseString(text, index);

    case 'nag':
      return parseNag(text, index);

    case 'symbol':
      return parseSymbol(text, index);
  }
}

function isWhitespace(character: string): boolean {
  return /\s/.test(character);
}

function findTokenType(
  text: string,
  index: number
): Exclude<TokenType, 'integer' | 'gameTermination'> {
  const character = text[index];
  switch (character) {
    case '.':
      return 'period';
    case '[':
      return 'leftBracket';
    case ']':
      return 'rightBracket';
    case '(':
      return 'leftParenthesis';
    case ')':
      return 'rightParenthesis';
    case '{':
      return 'comment';
    case '"':
      return 'string';
    case '$':
      return 'nag';
    default:
      if (/[*0-9a-zA-Z]/.test(character)) {
        return 'symbol';
      }
      throw new ParserError(`Unknown token type "${character}"`, {start: index});
  }
}

function parseComment(text: string, startIndex: number): Token {
  let index = startIndex + 1;
  let value = '';
  while (index < text.length) {
    const character = text[index];
    index++;
    if (character === '}') {
      break;
    } else {
      value += character;
    }
  }
  return {
    type: 'comment',
    value: value,
    start: startIndex,
    end: index
  };
}

function parseString(text: string, startIndex: number): Token {
  let index = startIndex + 1;
  let value = '';
  while (index < text.length) {
    const character = text[index];
    if (character === '"') {
      index++;
      break;
    }
    if (character === '\\') {
      index++;
      if (index < text.length) {
        value += text[index];
        index++;
      }
    } else {
      value += character;
      index++;
    }
  }

  return {
    type: 'string',
    value: value,
    start: startIndex,
    end: index
  };
}

function parseNag(text: string, startIndex: number): Token {
  let index = startIndex + 1;
  while (index < text.length && /[0-9]/.test(text[index])) {
    index++;
  }

  const value = text.substring(startIndex, index);
  return {
    type: 'nag',
    value: Number.parseInt(text.substring(startIndex + 1, index)),
    start: startIndex,
    end: startIndex + value.length
  };
}

function parseSymbol(text: string, startIndex: number): Token {
  const value = parseSymbolValue(text, startIndex);
  if (['*', '1-0', '0-1', '1/2-1/2'].includes(value)) {
    return {
      type: 'gameTermination',
      value: value,
      start: startIndex,
      end: startIndex + value.length
    };
  } else if (/^[0-9]+$/.test(value)) {
    return {
      type: 'integer',
      value: Number.parseInt(value),
      start: startIndex,
      end: startIndex + value.length
    };
  } else {
    return {
      type: 'symbol',
      value: value,
      start: startIndex,
      end: startIndex + value.length
    };
  }
}

function parseSymbolValue(text: string, startIndex: number): string {
  if (text[startIndex] === '*') {
    return text[startIndex];
  }
  let index = startIndex + 1;
  while (index < text.length && /[0-9a-zA-Z_+#=:/-]/.test(text[index])) {
    index++;
  }
  return text.substring(startIndex, index);
}
