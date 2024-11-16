import {Token, TokenType} from './token';

export function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  while (index < text.length) {
    const character = text[index];
    if (isWhitespace(character)) {
      index++;
      continue;
    }
    const token = parseToken(text, index);
    tokens.push(token);
    index = token.end;
  }
  return tokens;
}

function isWhitespace(character: string): boolean {
  return /\s/.test(character);
}

function parseToken(text: string, index: number): Token {
  const type = findTokenType(text[index]);
  switch (type) {
    case 'period':
    case 'asterisk':
    case 'leftBracket':
    case 'rightBracket':
    case 'leftParenthesis':
    case 'rightParenthesis':
    case 'leftAngleBracket':
    case 'rightAngleBracket':
      return {
        type: type,
        start: index,
        end: index + 1
      };

    case 'string':
      return parseString(text, index);

    case 'nag':
      return parseNag(text, index);

    case 'symbol':
      return parseSymbol(text, index);
  }
}

function findTokenType(character: string): Exclude<TokenType, 'integer'> {
  switch (character) {
    case '.':
      return 'period';
    case '*':
      return 'asterisk';
    case '[':
      return 'leftBracket';
    case ']':
      return 'rightBracket';
    case '(':
      return 'leftParenthesis';
    case ')':
      return 'rightParenthesis';
    case '<':
      return 'leftAngleBracket';
    case '>':
      return 'rightAngleBracket';
    case '"':
      return 'string';
    case '$':
      return 'nag';
    default:
      if (/[0-9a-zA-Z]/.test(character)) {
        return 'symbol';
      }
      throw new Error(`Unknown token type "${character}"`);
  }
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
  let index = startIndex + 1;
  while (index < text.length && /[0-9a-zA-Z_+#=:/-]/.test(text[index])) {
    index++;
  }

  const value = text.substring(startIndex, index);
  if (/^[0-9]+$/.test(value)) {
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
