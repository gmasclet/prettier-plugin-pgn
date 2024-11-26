import {Parser} from 'prettier';
import {ASTNode} from './astNode';
import {tokenize} from './tokenize';
import {parseLeaves} from './parseLeaves';
import {parseSections} from './parseSections';
import {parseGames} from './parseGames';
import {ParserError} from './parserError';

export class PgnParser implements Parser<ASTNode> {
  get astFormat(): string {
    return 'pgn-ast';
  }

  parse(text: string): ASTNode {
    try {
      const tokens = tokenize(text);
      const leaves = parseLeaves(tokens);
      const sections = parseSections(leaves);
      const games = parseGames(sections);
      return {
        type: 'root',
        games: games,
        start: games.length === 0 ? 0 : games[0].start,
        end: games.length === 0 ? 0 : games[games.length - 1].end
      };
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
