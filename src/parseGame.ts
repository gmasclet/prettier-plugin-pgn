import {GameNode, MoveTextSectionNode, TagPairSectionNode} from './astNode';
import {parseMove} from './parseMove';
import {parseTagPair} from './parseTagPair';
import {Tokenizer} from './tokenizer';
import {noValue, repeat} from './utils';

export function parseGame(tokens: Tokenizer): GameNode | undefined {
  const tagPairSection = parseTagPairSection(tokens);
  const moveTextSection = parseMoveTextSection(tokens);
  if (noValue(tagPairSection) && noValue(moveTextSection)) {
    return undefined;
  }
  return {
    type: 'game',
    tagPairSection: tagPairSection ?? {
      type: 'tagPairSection',
      tagPairs: [],
      start: moveTextSection!.start,
      end: moveTextSection!.start
    },
    moveTextSection: moveTextSection ?? {
      type: 'moveTextSection',
      moves: [],
      gameTermination: {
        type: 'gameTermination',
        value: '*',
        start: tagPairSection!.end,
        end: tagPairSection!.end
      },
      start: tagPairSection!.end,
      end: tagPairSection!.end
    },
    start: (tagPairSection ?? moveTextSection)!.start,
    end: (moveTextSection ?? tagPairSection)!.end
  };
}

function parseTagPairSection(tokens: Tokenizer): TagPairSectionNode | undefined {
  const tagPairs = repeat(() => parseTagPair(tokens));
  if (tagPairs.length === 0) {
    return undefined;
  }
  return {
    type: 'tagPairSection',
    tagPairs: tagPairs,
    start: tagPairs[0].start,
    end: tagPairs[tagPairs.length - 1].end
  };
}

function parseMoveTextSection(tokens: Tokenizer): MoveTextSectionNode | undefined {
  let moveNumber = 1;
  const moves = repeat(() => parseMove(tokens, {turn: 'white', number: moveNumber++}));
  const gameTermination = tokens.accept('gameTermination');
  if (moves.length === 0 && noValue(gameTermination)) {
    return undefined;
  }
  return {
    type: 'moveTextSection',
    moves: moves,
    gameTermination: gameTermination ?? {
      type: 'gameTermination',
      value: '*',
      start: moves[moves.length - 1].end,
      end: moves[moves.length - 1].end
    },
    start: (moves[0] ?? gameTermination).start,
    end: (gameTermination ?? moves[moves.length - 1]).end
  };
}
