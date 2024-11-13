export type Options = Record<string, unknown>;

export type ASTNode = {
  content: string;
  start: number;
  end: number;
};
