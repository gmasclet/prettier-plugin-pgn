import {Parser} from 'prettier';
import {ASTNode} from './astNode';
import {ParserError} from './parserError';
import {parseFile} from './parseFile';
import {Tokenizer} from './tokenizer';

/**
 * Implement the Prettier `Parser` interface, for the PGN format.
 *
 * This is a recursive descent parser. The algorithm proceeds in a top-down manner: the entry point
 * parses the root node of the abstract syntax tree, which is done by parsing its child nodes, and
 * so on down to the leaf nodes.
 *
 * These leaf nodes are built by assembling the base tokens of the grammar, which are lazily read
 * from the input text using the `Tokenizer` class.
 */
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
