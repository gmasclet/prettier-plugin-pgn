import {AstPath, doc, Doc, ParserOptions, Printer} from 'prettier';
import {ASTNode} from './astNode';

const {fill, hardline, indent, join, line} = doc.builders;

export class PgnPrinter implements Printer<ASTNode> {
  print(
    path: AstPath<ASTNode>,
    _options: ParserOptions<ASTNode>,
    print: (path: AstPath<ASTNode>) => Doc
  ): Doc {
    const node = path.node;
    switch (node.type) {
      case 'file':
        return join([hardline, hardline], path.map(print, 'games'));

      case 'game':
        if (node.tagPairSection.tagPairs.length === 0) {
          return path.call(print, 'moveTextSection');
        } else {
          return [
            path.call(print, 'tagPairSection'),
            hardline,
            hardline,
            path.call(print, 'moveTextSection')
          ];
        }

      case 'tagPairSection':
        return join(hardline, path.map(print, 'tagPairs'));

      case 'tagPair':
        return `[${node.name} ${this.quote(node.value)}]`;

      case 'moveTextSection':
        return fill(join(line, [...path.map(print, 'moves'), path.call(print, 'gameTermination')]));

      case 'fullMove':
        return fill([
          `${node.number}.`,
          path.call(print, 'white'),
          line,
          path.call(print, 'black')
        ]);

      case 'whiteMove':
        return fill([`${node.number}.`, path.call(print, 'white')]);

      case 'blackMove':
        return fill([`${node.number}...`, path.call(print, 'black')]);

      case 'halfMove':
        if (node.variations.length > 0) {
          return [node.value, indent([hardline, join(hardline, path.map(print, 'variations'))])];
        } else {
          return node.value;
        }

      case 'variation':
        return fill(['(', ...join(line, [...path.map(print, 'moves')]), ')']);

      case 'gameTermination':
        return node.value;
    }
  }

  private quote(value: string): string {
    return `"${value.replace(/[\\|"]/g, (v) => '\\' + v)}"`;
  }
}
