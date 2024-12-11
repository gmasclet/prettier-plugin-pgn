export type TokenType = BaseTokenType | StringTokenType | NumberTokenType;

type BaseTokenType =
  | 'period'
  | 'leftBracket'
  | 'rightBracket'
  | 'leftParenthesis'
  | 'rightParenthesis';

type StringTokenType = 'comment' | 'string' | 'symbol' | 'gameTermination';

type NumberTokenType = 'integer' | 'nag';

export type Token<T extends TokenType = TokenType> = T extends BaseTokenType
  ? BaseToken<T>
  : T extends StringTokenType
    ? StringToken<T>
    : T extends NumberTokenType
      ? NumberToken<T>
      : never;

interface StringToken<T> extends BaseToken<T> {
  value: string;
}

interface NumberToken<T> extends BaseToken<T> {
  value: number;
}

interface BaseToken<T> {
  type: T;
  start: number;
  end: number;
}
