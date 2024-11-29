import {AstPath, doc, Doc, ParserOptions, Printer} from 'prettier';
import {ASTNode} from './astNode';

const {hardline, group, join} = doc.builders;

export class PgnPrinter implements Printer<ASTNode> {
  print(
    path: AstPath<ASTNode>,
    _options: ParserOptions<ASTNode>,
    print: (path: AstPath<ASTNode>) => Doc
  ): Doc {
    const node = path.node;
    switch (node.type) {
      case 'file':
        return join(hardline, path.map(print, 'games'));

      case 'game':
        return [
          path.call(print, 'tagPairSection'),
          hardline,
          hardline,
          path.call(print, 'moveTextSection')
        ];
      case 'tagPairSection':
        return join(hardline, path.map(print, 'tagPairs'));

      case 'tagPair':
        return group(['[', node.name, ' ', this.quote(node.value), ']']);

      case 'moveTextSection':
        return join(' ', [...path.map(print, 'moves'), path.call(print, 'gameTermination')]);

      case 'fullMove':
        return group([
          `${node.number}.`,
          path.call(print, 'white'),
          ' ',
          path.call(print, 'black')
        ]);

      case 'whiteMove':
        return group([`${node.number}.`, path.call(print, 'white')]);

      case 'blackMove':
        return group([`${node.number}...`, path.call(print, 'black')]);

      case 'halfMove':
      case 'gameTermination':
        return node.value;
    }
  }

  private quote(value: string): string {
    return `"${value.replace(/[\\|"]/g, (v) => '\\' + v)}"`;
  }
}
