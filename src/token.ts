export type TokenType =
  | 'period'
  | 'asterisk'
  | 'leftBracket'
  | 'rightBracket'
  | 'leftParenthesis'
  | 'rightParenthesis'
  | 'leftAngleBracket'
  | 'rightAngleBracket'
  | 'string'
  | 'symbol'
  | 'integer'
  | 'nag';

export type Token = SimpleToken | AsteriskToken | StringToken | SymbolToken | NumberToken;

export interface SimpleToken extends BaseToken {
  type:
    | 'period'
    | 'leftBracket'
    | 'rightBracket'
    | 'leftParenthesis'
    | 'rightParenthesis'
    | 'leftAngleBracket'
    | 'rightAngleBracket';
}

export interface AsteriskToken extends BaseToken {
  type: 'asterisk';
}

export interface StringToken extends BaseToken {
  type: 'string';
  value: string;
}

export interface SymbolToken extends BaseToken {
  type: 'symbol';
  value: string;
}

export interface NumberToken extends BaseToken {
  type: 'integer' | 'nag';
  value: number;
}

interface BaseToken {
  type: TokenType;
  start: number;
  end: number;
}
