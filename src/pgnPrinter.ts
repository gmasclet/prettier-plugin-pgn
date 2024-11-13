import {AstPath, Doc, Printer} from 'prettier';
import {ASTNode} from './types';

export class PgnPrinter implements Printer<ASTNode> {
  print(path: AstPath<ASTNode>): Doc {
    return path.node.content;
  }
}
