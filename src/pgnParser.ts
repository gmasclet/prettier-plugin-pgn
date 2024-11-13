import {Parser} from 'prettier';
import {ASTNode} from './types';

export class PgnParser implements Parser<ASTNode> {
  get astFormat(): string {
    return 'pgn-ast';
  }

  parse(text: string): ASTNode {
    return {content: text, start: 0, end: 0};
  }

  locStart(node: ASTNode): number {
    return node.start;
  }

  locEnd(node: ASTNode): number {
    return node.end;
  }
}
