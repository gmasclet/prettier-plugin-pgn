import * as assert from 'node:assert';
import {describe, it} from 'node:test';
import * as prettier from 'prettier';

describe('Index', () => {
  it('Should format an empty string', async () => {
    const result = await prettier.format('', {
      parser: 'pgn-parse',
      plugins: ['./dist/index.js']
    });

    assert.strictEqual(result, '');
  });

  it('Should format a simple PGN text', async () => {
    const result = await prettier.format(
      '[Event "F/S Return Match"] 1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 *',
      {
        parser: 'pgn-parse',
        plugins: ['./dist/index.js']
      }
    );

    assert.strictEqual(result, '[Event "F/S Return Match"]\n\n1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 *');
  });
});
