import {
  GameTerminationNode,
  HalfMoveNode,
  LeafNode,
  MoveNode,
  MoveTextSectionNode,
  SectionNode,
  TagPairNode,
  TagPairSectionNode
} from './astNode';

export function parseSections(nodes: LeafNode[]): SectionNode[] {
  const sections: SectionNode[] = [];
  let index = 0;
  while (index < nodes.length) {
    const {section, length} = parseSection(nodes, index);
    sections.push(section);
    index += length;
  }
  return sections;
}

function parseSection(nodes: LeafNode[], index: number): {section: SectionNode; length: number} {
  const node = nodes[index];
  switch (node.type) {
    case 'tagPair':
      return parseTagPairSection(nodes, index);

    case 'halfMove':
    case 'gameTermination':
      return parseMoveTextSection(nodes, index);
  }
}

function parseTagPairSection(
  nodes: LeafNode[],
  startIndex: number
): {section: TagPairSectionNode; length: number} {
  const tagPairs: TagPairNode[] = [];
  let index = startIndex;
  while (index < nodes.length) {
    const node = nodes[index];
    if (node.type !== 'tagPair') {
      break;
    }
    tagPairs.push(node);
    index++;
  }
  return {
    section: {
      type: 'tagPairSection',
      tagPairs: tagPairs,
      start: tagPairs[0].start,
      end: tagPairs[tagPairs.length - 1].end
    },
    length: index - startIndex
  };
}

function parseMoveTextSection(
  nodes: LeafNode[],
  startIndex: number
): {section: MoveTextSectionNode; length: number} {
  const halfMoves: HalfMoveNode[] = [];
  let gameTermination: GameTerminationNode | undefined = undefined;
  let index = startIndex;
  while (index < nodes.length) {
    const node = nodes[index];
    if (node.type === 'tagPair') {
      break;
    }
    if (node.type === 'halfMove') {
      halfMoves.push(node);
    }
    if (node.type === 'gameTermination') {
      gameTermination = node;
    }
    index++;
  }

  if (gameTermination === undefined) {
    gameTermination = {
      type: 'gameTermination',
      value: '*',
      start: halfMoves[halfMoves.length - 1].end,
      end: halfMoves[halfMoves.length - 1].end
    };
  }

  return {
    section: {
      type: 'moveTextSection',
      moves: joinHalfMoves(halfMoves),
      gameTermination: gameTermination,
      start: (halfMoves[0] ?? gameTermination).start,
      end: (gameTermination ?? halfMoves[halfMoves.length - 1]).end
    },
    length: index - startIndex
  };
}

function joinHalfMoves(halfMoves: HalfMoveNode[]): MoveNode[] {
  return halfMoves
    .reduce(
      (result, _, index, sourceArray) =>
        index % 2 === 0 ? [...result, sourceArray.slice(index, index + 2)] : result,
      new Array<HalfMoveNode[]>()
    )
    .map(([white, black], index) => ({
      type: black === undefined ? 'whiteMove' : 'fullMove',
      number: index + 1,
      white: white,
      black: black,
      start: (white ?? black).start,
      end: (black ?? white).end
    }));
}
