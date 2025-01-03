import * as assert from 'node:assert';
import {describe, it} from 'node:test';
import * as prettier from 'prettier';

describe('Index', () => {
  it('Should format an empty string', async () => {
    await expectFormat('');
  });

  it('Should format a simple game', async () => {
    await expectFormat(`
      [Event "F/S Return Match"]

      1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 *
    `);
  });

  it('Should format a complete game', async () => {
    await expectFormat(`
      [Event "F/S Return Match"]
      [Site "Belgrade, Serbia JUG"]
      [Date "1992.11.04"]
      [Round "29"]
      [White "Fischer, Robert J."]
      [Black "Spassky, Boris V."]
      [Result "1/2-1/2"]

      1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.h3
      Nb8 10.d4 Nbd7 11.c4 c6 12.cxb5 axb5 13.Nc3 Bb7 14.Bg5 b4 15.Nb1 h6 16.Bh4 c5
      17.dxe5 Nxe4 18.Bxe7 Qxe7 19.exd6 Qf6 20.Nbd2 Nxd6 21.Nc4 Nxc4 22.Bxc4 Nb6
      23.Ne5 Rae8 24.Bxf7+ Rxf7 25.Nxf7 Rxe1+ 26.Qxe1 Kxf7 27.Qe3 Qg5 28.Qxg5 hxg5
      29.b3 Ke6 30.a3 Kd6 31.axb4 cxb4 32.Ra5 Nd5 33.f3 Bc8 34.Kf2 Bf5 35.Ra7 g6
      36.Ra6+ Kc5 37.Ke1 Nf4 38.g3 Nxh3 39.Kd2 Kb5 40.Rd6 Kc5 41.Ra6 Nf2 42.g4 Bd3
      43.Re6 1/2-1/2
    `);
  });

  it('Should put an empty line between each game', async () => {
    await expectFormat(`
      [Event "F/S Return Match"]
      [Site "Belgrade, Serbia JUG"]

      1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 *

      [White "Adolf Anderssen"]
      [Black "Lionel Kieseritzky"]

      1.e4 e5 2.f4 exf4 3.Bc4 Qh4+ *
    `);
  });

  it('Should format games without tag pairs', async () => {
    await expectFormat(`
      1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 *

      1.d4 d5 2.c4 e6 3.Nc3 Nf6 *

      1.e4 e6 2.d4 d5 3.Nc3 Nf6 *
    `);
  });

  it('Should format a game with a variation', async () => {
    await expectFormat(`
      [Event "F/S Return Match"]

      1.e4 e5
        (1...e6 2.d4)
      2.Nf3 Nc6 3.Bb5 a6 *
    `);
  });

  it('Should format a game with several variations', async () => {
    await expectFormat(`
      [Event "F/S Return Match"]

      1.e4 e5
        (1...e6 2.d4)
        (1...c5 2.Nf3)
      2.Nf3 Nc6 3.Bb5 a6 *
    `);
  });

  it('Should format a game with nested variations', async () => {
    await expectFormat(`
      [Event "F/S Return Match"]

      1.e4 e5
        (1...e6 2.d4
          (2.d3))
      2.Nf3 Nc6 3.Bb5 a6 *
    `);
  });

  it('Should format a game with an empty comment in the movetext', async () => {
    await expectFormat(`
      [Event "F/S Return Match"]

      1.e4 e5 2.Nf3 Nc6 3.Bb5
        {}
      3...a6 *
    `);
  });

  it('Should format a game with a short comment in the movetext', async () => {
    await expectFormat(`
      [Event "F/S Return Match"]

      1.e4 e5 2.Nf3 Nc6 3.Bb5
        {The Ruy Lopez}
      3...a6 *
    `);
  });

  it('Should format a game with a long comment spanning over several lines in the movetext', async () => {
    await expectFormat(`
      [Event "F/S Return Match"]

      1.e4 e5 2.Nf3 Nc6 3.Bb5
        {The essential move marking the Spanish Game, or Ruy Lopez. It is the double king's
        pawn opening most commonly used in master play; it has been adopted by almost all
        players at some point in their careers and many play it from both the White and
        Black sides.}
      3...a6 *
    `);
  });

  it('Should format a game with a short comment in a variation', async () => {
    await expectFormat(`
      [Event "F/S Return Match"]

      1.e4 e5
        (1...e6 2.d4 d5 {The French Defense})
      2.Nf3 Nc6 3.Bb5 a6 *
    `);
  });

  it('Should format a game with a long comment in a variation', async () => {
    await expectFormat(`
      [Event "F/S Return Match"]

      1.e4 e5
        (1...e6 {The main line of the French Defence continues 2.d4 d5. White sets up
        a pawn centre, which Black immediately challenges by attacking the pawn on e4.})
      2.Nf3 Nc6 3.Bb5 a6 *
    `);
  });

  it('Should format a game with a comment before the movetext', async () => {
    await expectFormat(`
      [Event "F/S Return Match"]

      {The 1992 Fischer–Spassky match was a chess match between former world chess champions
      Bobby Fischer and Boris Spassky. It was billed as a World Chess Championship, though
      it was an unofficial rematch of their 1972 World Championship match.}
      1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 *
    `);
  });

  it('Should format a game with a header comment', async () => {
    await expectFormat(`
      {The 1992 Fischer–Spassky match was a chess match between former world chess champions
      Bobby Fischer and Boris Spassky. It was billed as a World Chess Championship, though
      it was an unofficial rematch of their 1972 World Championship match.}
      [Event "F/S Return Match"]

      1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 *
    `);
  });

  it('Should format a game with a footer comment', async () => {
    await expectFormat(`
      [Event "F/S Return Match"]

      1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 *
      {The 1992 Fischer–Spassky match was a chess match between former world chess champions
      Bobby Fischer and Boris Spassky. It was billed as a World Chess Championship, though
      it was an unofficial rematch of their 1972 World Championship match.}
    `);
  });

  it('Should format a game with annotations and comments', async () => {
    await expectFormat(`
      [Event "F/S Return Match"]

      1.e4 e5 2.Nf3 Nc6! ~ 3.Bb5!? =
        {The Ruy Lopez}
      3...a6!! $10 *
    `);
  });

  async function expectFormat(text: string) {
    const expected = trimIndent(text);
    const result = await prettier.format(expected, {
      parser: 'pgn',
      plugins: ['./dist/index.js']
    });

    assert.strictEqual(result, expected);
  }

  function trimIndent(text: string): string {
    if (!text.includes('\n')) {
      return text;
    }
    const lines = text.split('\n');
    const indent = [...lines[1]].findIndex((character) => /[^\s]/.test(character));
    return lines
      .slice(1, lines.length - 1)
      .map((line) => line.substring(indent))
      .join('\n')
      .concat('\n');
  }
});
