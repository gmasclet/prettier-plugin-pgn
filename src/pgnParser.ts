import {Parser} from 'prettier';
import {ASTNode} from './astNode';
import {ParserError} from './parserError';
import {parseFile} from './parseFile';
import {Tokenizer} from './tokenizer';

export class PgnParser implements Parser<ASTNode> {
  get astFormat(): string {
    return 'pgn';
  }

  parse(text: string): ASTNode {
    try {
      return parseFile(new Tokenizer(text));
    } catch (error) {
      throw error instanceof ParserError ? error.convertToPrettierError(text) : error;
    }
  }

  locStart(node: ASTNode): number {
    return node.start;
  }

  locEnd(node: ASTNode): number {
    return node.end;
  }
}
