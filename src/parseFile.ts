import {FileNode} from './astNode';
import {parseGame} from './parseGame';
import {Tokenizer} from './tokenizer';
import {repeat} from './utils';

export function parseFile(tokens: Tokenizer): FileNode {
  const games = repeat(() => parseGame(tokens));
  tokens.expectEndOfFile();
  return {
    type: 'file',
    games: games,
    start: games.length === 0 ? 0 : games[0].start,
    end: games.length === 0 ? 0 : games[games.length - 1].end
  };
}
