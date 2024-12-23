import {PgnParser} from './pgnParser';
import {PgnPrinter} from './pgnPrinter';

export const languages = [
  {
    name: 'Portable Game Notation',
    parsers: ['pgn'],
    extensions: ['.pgn']
  }
];

export const parsers = {
  pgn: new PgnParser()
};

export const printers = {
  pgn: new PgnPrinter()
};

export const options = {};
