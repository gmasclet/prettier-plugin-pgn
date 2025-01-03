export type ASTNode =
  | FileNode
  | GameNode
  | TagPairSectionNode
  | TagPairNode
  | MoveTextSectionNode
  | MoveNode
  | AnnotationNode
  | CommentNode
  | VariationNode
  | GameTerminationNode;

export interface FileNode extends BaseNode {
  type: 'file';
  comments: CommentNode[];
  games: GameNode[];
}

export interface GameNode extends BaseNode {
  type: 'game';
  tagPairSection: TagPairSectionNode;
  moveTextSection: MoveTextSectionNode;
}

export interface TagPairSectionNode extends BaseNode {
  type: 'tagPairSection';
  tagPairs: TagPairNode[];
}

export interface TagPairNode extends BaseNode {
  type: 'tagPair';
  name: string;
  value: string;
}

export interface MoveTextSectionNode extends BaseNode {
  type: 'moveTextSection';
  moves: MoveNode[];
  gameTermination: GameTerminationNode;
}

export interface MoveNode extends BaseNode {
  type: 'move';
  number: number;
  turn: 'white' | 'black';
  value: string;
  suffix: AnnotationNode | undefined;
  annotations: AnnotationNode[];
  comments: CommentNode[];
  variations: VariationNode[];
}

export interface AnnotationNode extends BaseNode {
  type: 'annotation';
  value: string;
}

export interface CommentNode extends BaseNode {
  type: 'comment';
  value: string;
}

export interface VariationNode extends BaseNode {
  type: 'variation';
  moves: MoveNode[];
}

export interface GameTerminationNode extends BaseNode {
  type: 'gameTermination';
  value: string;
}

interface BaseNode {
  type: ASTNode['type'];
  start: number;
  end: number;
}
