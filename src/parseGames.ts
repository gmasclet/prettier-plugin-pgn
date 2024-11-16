import {GameNode, SectionNode} from './astNode';

export function parseGames(sections: SectionNode[]): GameNode[] {
  const games: GameNode[] = [];
  let index = 0;
  while (index < sections.length) {
    const {game, length} = parseGame(sections, index);
    games.push(game);
    index += length;
  }
  return games;
}

function parseGame(nodes: SectionNode[], index: number): {game: GameNode; length: number} {
  const node = nodes[index];
  if (node.type === 'moveTextSection') {
    return {
      game: {
        type: 'game',
        tagPairSection: {
          type: 'tagPairSection',
          tagPairs: [],
          start: node.start,
          end: node.start
        },
        moveTextSection: node,
        start: node.start,
        end: node.end
      },
      length: 1
    };
  }

  const tagPairSection = node;
  const moveTextSection = index + 1 < nodes.length ? nodes[index + 1] : undefined;
  if (moveTextSection === undefined || moveTextSection.type !== 'moveTextSection') {
    return {
      game: {
        type: 'game',
        tagPairSection: tagPairSection,
        moveTextSection: {
          type: 'moveTextSection',
          moves: [],
          gameTermination: {
            type: 'gameTermination',
            value: '*',
            start: tagPairSection.end,
            end: tagPairSection.end
          },
          start: tagPairSection.end,
          end: tagPairSection.end
        },
        start: tagPairSection.start,
        end: tagPairSection.end
      },
      length: 1
    };
  }

  return {
    game: {
      type: 'game',
      tagPairSection: tagPairSection,
      moveTextSection: moveTextSection,
      start: tagPairSection.start,
      end: moveTextSection.end
    },
    length: 2
  };
}
