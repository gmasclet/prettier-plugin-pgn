<h1 align="center">Prettier PGN plugin</h1>

Prettier is an opinionated code formatter. It enforces a consistent style by parsing your code and
re-printing it with its own rules that take the maximum line length into account, wrapping code
when necessary.

This plugin adds support for the Portable Game Notation format to Prettier.

Portable Game Notation (PGN) is a standard plain text format for recording chess games (both the
moves and related data), which can be read by humans and is also supported by most chess software.

# Example

This sample game:

```
[Event "Immortal Game"][Date "1851.06.21"][White "Anderssen, Adolf"][Black
"Kieseritzky, Lionel"][Result "*"] 1.e2-e4 e7-e5 f4 exf4 3.Bc4 3...Qh4+
4.Kf1 b5 {C33 King's Gambit Accepted: Bishop's Gambit, Bryan
Countergambit} 5.Bxb5 Nf6 6.Nf3 Qh6 7.d3 Nh5 8.Nh4 ?! {Inaccuracy. Rg1 was
best.} (8.Rg1 c6 9.Bc4 Be7 10.Nc3 O-O 11.Kf2 Nf6 12.Re1 Ng4+ 13.Kg1 Ba6
14.Bxa6 Nxa6 15.Qe2 Bc5+ 16.d4 Bxd4+ 17.Nxd4) 8...Qg5 9.Nf5 c6 {White
eventually won by checkmate after 23 moves.} *
```

will be transformed to this:

```
[Event "Immortal Game"]
[Date "1851.06.21"]
[White "Anderssen, Adolf"]
[Black "Kieseritzky, Lionel"]
[Result "*"]

1.e4 e5 2.f4 exf4 3.Bc4 Qh4+ 4.Kf1 b5
  {C33 King's Gambit Accepted: Bishop's Gambit, Bryan Countergambit}
5.Bxb5 Nf6 6.Nf3 Qh6 7.d3 Nh5 8.Nh4?!
  {Inaccuracy. Rg1 was best.}
  (8.Rg1 c6 9.Bc4 Be7 10.Nc3 O-O 11.Kf2 Nf6 12.Re1 Ng4+ 13.Kg1 Ba6 14.Bxa6 Nxa6
  15.Qe2 Bc5+ 16.d4 Bxd4+ 17.Nxd4)
8...Qg5 9.Nf5 c6
  {White eventually won by checkmate after 23 moves.}
*
```

# Getting started

To run `prettier` with the PGN plugin, you're going to need [node](https://nodejs.org/en/download/).

Install `prettier` and the plugin using the npm CLI:

```bash
# Install locally if you intent to use Prettier in a specific folder
npm install --save-dev prettier prettier-plugin-pgn

# Or globally, which can be handy to format PGN files in any folder
npm install --global prettier prettier-plugin-pgn
```

# Usage

The plugin can be activated in your [Prettier configuration file](https://prettier.io/docs/en/configuration):

```json
{
  "plugins": ["prettier-plugin-pgn"]
}
```

Alternatively, it may be declared directly in the CLI, using the `--plugin` option:

```bash
npx prettier --plugin="prettier-plugin-pgn" --write "path/to/file.pgn" 
```

# Features

This plugin supports most of the PGN specification. In particular, it supports:
* Variations (including nested ones).
* Annotations (either NAG, or most commons literal annotations).
* Comments (only those inside braces).
* PGN files with multiple games are supported.
* Whenever possible, the plugin is lenient. It will accept a non canonical PGN game as long as it is unambiguous.

The following PGN features are currently not supported by this plugin:
* "Rest of line" comments (those starting with a semicolon character and continuing to the end of the line).
* Escaped lines using a percent sign character (`%`).

# License

The package is available as open source under the terms of the [MIT License](https://opensource.org/license/MIT).
