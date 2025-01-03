import {AstPath, doc, Doc, ParserOptions, Printer} from 'prettier';
import {ASTNode, CommentNode, MoveNode} from './astNode';

const {fill, hardline, indent, join, line} = doc.builders;

/**
 * Implement the Prettier `Printer` interface, for the PGN format.
 */
export class PgnPrinter implements Printer<ASTNode> {
  print(
    path: AstPath<ASTNode>,
    _options: ParserOptions<ASTNode>,
    print: (path: AstPath<ASTNode>) => Doc
  ): Doc {
    const node = path.node;
    switch (node.type) {
      case 'file':
        return [join([hardline, hardline], path.map(print, 'games')), hardline];

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
        if (node.moves.length === 0) {
          return path.call(print, 'gameTermination');
        } else {
          return fill([
            ...this.printMoves(path, print),
            this.getMoveSeparator(node.moves[node.moves.length - 1]),
            path.call(print, 'gameTermination')
          ]);
        }

      case 'move':
        return this.printMove(path, print);

      case 'annotation':
        return node.value;

      case 'comment':
        return this.printCommentNode(path.node as CommentNode);

      case 'variation':
        return fill(['(', ...this.printMoves(path, print), ')']);

      case 'gameTermination':
        return node.value;
    }
  }

  private quote(value: string): string {
    return `"${value.replace(/[\\|"]/g, (v) => '\\' + v)}"`;
  }

  private printMoves(path: AstPath<ASTNode>, print: (path: AstPath<ASTNode>) => Doc): Doc[] {
    const result: Doc[] = [];
    path.each((move) => {
      result.push(...this.printMove(move, print));
      if (!move.isLast) {
        result.push(this.getMoveSeparator(move.node, path.node.type === 'variation'));
      }
    }, 'moves');
    return result;
  }

  private getMoveSeparator(move: MoveNode, isVariation = false) {
    return (!isVariation && move.comments.length > 0) || move.variations.length > 0
      ? hardline
      : line;
  }

  private printMove(path: AstPath<ASTNode>, print: (path: AstPath<ASTNode>) => Doc): Doc[] {
    const node = path.node as MoveNode;
    const parts: Doc[] = [this.printMoveValue(path)];
    if (node.annotations.length > 0) {
      parts.push(
        ...[line, ...join(line, path.map(print, 'annotations')).flatMap((value) => value)]
      );
    }
    if (node.comments.length > 0) {
      if (path.parent?.type === 'moveTextSection') {
        parts.push(
          indent([
            hardline,
            join(
              hardline,
              node.comments.map((comment) => fill(this.printCommentNode(comment)))
            )
          ])
        );
      } else {
        parts.push(
          ...[
            line,
            ...join(
              line,
              node.comments.map((comment) => this.printCommentNode(comment))
            ).flatMap((value) => value)
          ]
        );
      }
    }
    if (node.variations.length > 0) {
      parts.push(indent([hardline, join(hardline, path.map(print, 'variations'))]));
    }
    return parts;
  }

  private printMoveValue(path: AstPath<ASTNode>): Doc {
    const node = path.node as MoveNode;
    const value = node.value + (node.suffix?.value ?? '');
    if (node.turn === 'white') {
      return `${node.number}.${value}`;
    } else if (
      path.isFirst ||
      (path.previous?.type === 'move' &&
        (path.previous.comments.length > 0 || path.previous.variations.length > 0))
    ) {
      return `${node.number}...${value}`;
    }
    return value;
  }

  private printCommentNode(node: CommentNode): Doc[] {
    return [
      '{',
      ...join(
        line,
        node.value
          .trim()
          .split(/\s/)
          .filter((part) => part.length > 0)
      ),
      '}'
    ];
  }

  canAttachComment(node: ASTNode): boolean {
    return node.type !== 'comment';
  }

  willPrintOwnComments(path: AstPath<ASTNode>): boolean {
    return path.node.type === 'move';
  }

  printComment(path: AstPath<ASTNode>): Doc {
    return fill(this.printCommentNode(path.node as CommentNode));
  }
}
