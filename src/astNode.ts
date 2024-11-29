export type ASTNodeType =
  | 'file'
  | 'game'
  | 'tagPairSection'
  | 'moveTextSection'
  | 'tagPair'
  | 'fullMove'
  | 'whiteMove'
  | 'blackMove'
  | 'halfMove'
  | 'gameTermination';

export type ASTNode = FileNode | GameNode | SectionNode | MoveNode | LeafNode;

export type SectionNode = TagPairSectionNode | MoveTextSectionNode;

export type LeafNode = TagPairNode | HalfMoveNode | GameTerminationNode;

export interface FileNode extends BaseNode {
  type: 'file';
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

export interface MoveTextSectionNode extends BaseNode {
  type: 'moveTextSection';
  moves: MoveNode[];
  gameTermination: GameTerminationNode;
}

export interface TagPairNode extends BaseNode {
  type: 'tagPair';
  name: string;
  value: string;
}

export type MoveNode = FullMoveNode | WhiteMoveNode | BlackMoveNode;

export interface FullMoveNode extends BaseMoveNode {
  type: 'fullMove';
  white: HalfMoveNode;
  black: HalfMoveNode;
}

export interface WhiteMoveNode extends BaseMoveNode {
  type: 'whiteMove';
  white: HalfMoveNode;
}

export interface BlackMoveNode extends BaseMoveNode {
  type: 'blackMove';
  black: HalfMoveNode;
}

interface BaseMoveNode extends BaseNode {
  number: number;
}

export interface HalfMoveNode extends BaseNode {
  type: 'halfMove';
  value: string;
}

export interface GameTerminationNode extends BaseNode {
  type: 'gameTermination';
  value: string;
}

interface BaseNode {
  type: ASTNodeType;
  start: number;
  end: number;
}
