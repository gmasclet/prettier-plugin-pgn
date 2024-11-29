import {ParserError} from './parserError';
import {Token, TokenType} from './token';
import {parseToken} from './parseToken';
import {hasValue, noValue} from './utils';

export class Tokenizer {
  private buffer: Token | undefined;
  private index = 0;

  constructor(private readonly text: string) {}

  accept<T extends TokenType>(tokenType: T): Token<T> | undefined {
    const token = this.fetch();
    if (noValue(token)) {
      return undefined;
    }
    if (token.type !== tokenType) {
      return undefined;
    }
    this.buffer = undefined;
    return token as Token<T>;
  }

  expect<T extends TokenType>(tokenType: T): Token<T> {
    const token = this.fetch();
    if (noValue(token)) {
      const loc = {start: this.text.length};
      throw new ParserError(`Unexpected end of file, was expecting a ${tokenType}`, loc);
    }
    if (token.type !== tokenType) {
      throw new ParserError(`Unexpected token ${token.type}, was expecting a ${tokenType}`, token);
    }
    this.buffer = undefined;
    return token as Token<T>;
  }

  expectEndOfFile(): void {
    const token = this.fetch();
    if (hasValue(token)) {
      throw new ParserError(`Unexpected token ${token.type}`, token);
    }
  }

  private fetch(): Token | undefined {
    if (noValue(this.buffer)) {
      const token = parseToken(this.text, this.index);
      if (hasValue(token)) {
        this.buffer = token;
        this.index = token.end;
      }
    }
    return this.buffer;
  }
}
