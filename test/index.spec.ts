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
});
