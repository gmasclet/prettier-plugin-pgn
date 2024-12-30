import * as assert from 'node:assert';
import {describe, it} from 'node:test';
import {ParserError} from '../src/parserError';

describe('ParserError', () => {
  it('should convert to a Prettier error with the correct location', () => {
    const error = new ParserError('Unexpected token @', {start: 65});
    const text = '[Event "F/S Return Match"]\n\n1. e4 e5\n2. Nf3 Nc6\n3. Bb5 a6\n4. Ba4 @\n*';
    const prettierError = error.convertToPrettierError(text);

    assert(prettierError instanceof SyntaxError);
    assert('loc' in prettierError);
    assert.strictEqual(prettierError.message, 'Unexpected token @ (6:8)');
    assert.deepStrictEqual(prettierError.loc, {start: {line: 6, column: 8}});
  });
});
