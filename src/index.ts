import {PgnParser} from './pgnParser';
import {PgnPrinter} from './pgnPrinter';
import {Options} from './options';

export const options: Options = {};

export const languages = [
  {
    name: 'Portable Game Notation',
    parsers: ['pgn-parse'],
    extensions: ['.pgn']
  }
];

export const parsers = {
  'pgn-parse': new PgnParser()
};

export const printers = {
  'pgn-ast': new PgnPrinter()
};
