export class ParserError extends Error {
  constructor(
    message: string,
    private readonly loc: {start: number}
  ) {
    super(message);
  }

  convertToPrettierError(text: string): Error {
    return new PrettierError(this.message, {start: this.findLoc(text, this.loc.start)}, this);
  }

  private findLoc(text: string, index: number): {line: number; column: number} {
    const lines = text.substring(0, index).split('\n');
    return {line: lines.length, column: lines[lines.length - 1].length + 1};
  }
}

class PrettierError extends SyntaxError {
  constructor(
    message: string,
    public readonly loc: {start: {line: number; column: number}},
    public readonly cause: Error
  ) {
    super(`${message} (${loc.start.line}:${loc.start.column})`);
  }
}
