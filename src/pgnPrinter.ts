import {AstPath, doc, Doc, ParserOptions, Printer} from 'prettier';
import {ASTNode, MoveNode} from './astNode';

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
        return fill([...path.map(print, 'moves'), path.call(print, 'gameTermination')]);

      case 'move':
        return this.printMove(path, print);

      case 'variation':
        return fill(['(', ...path.map(print, 'moves'), ')']);

      case 'gameTermination':
        return node.value;
    }
  }

  private quote(value: string): string {
    return `"${value.replace(/[\\|"]/g, (v) => '\\' + v)}"`;
  }

  private printMove(path: AstPath<ASTNode>, print: (path: AstPath<ASTNode>) => Doc): Doc {
    const node = path.node as MoveNode;
    const parts: Doc[] = [this.printMoveValue(path)];
    if (node.variations.length > 0) {
      parts.push(indent([hardline, join(hardline, path.map(print, 'variations'))]));
    }
    if (this.needMoveSeparator(path)) {
      parts.push(node.variations.length > 0 ? hardline : line);
    }
    return parts.length === 1 ? parts[0] : parts;
  }

  private printMoveValue(path: AstPath<ASTNode>): Doc {
    const node = path.node as MoveNode;
    if (node.turn === 'white') {
      return `${node.number}.${node.value}`;
    } else if (
      path.isFirst ||
      (path.previous?.type === 'move' && path.previous.variations.length > 0)
    ) {
      return `${node.number}...${node.value}`;
    }
    return node.value;
  }

  private needMoveSeparator(path: AstPath<ASTNode>): boolean {
    return !path.isLast || path.parent?.type === 'moveTextSection';
  }
}
