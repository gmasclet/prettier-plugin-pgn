export type TokenType = BaseTokenType | StringTokenType | NumberTokenType;

type BaseTokenType =
  | 'period'
  | 'leftBracket'
  | 'rightBracket'
  | 'leftParenthesis'
  | 'rightParenthesis';

type StringTokenType = 'annotation' | 'comment' | 'string' | 'symbol' | 'gameTermination';

type NumberTokenType = 'integer';

export type Token<T extends TokenType = TokenType> = T extends BaseTokenType
  ? BaseToken<T>
  : T extends StringTokenType
    ? ValueToken<T, string>
    : T extends NumberTokenType
      ? ValueToken<T, number>
      : never;

interface ValueToken<T, V> extends BaseToken<T> {
  value: V;
}

interface BaseToken<T> {
  type: T;
  start: number;
  end: number;
}
