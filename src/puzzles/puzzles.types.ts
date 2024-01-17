type FigureTypes = 'rook' | 'pawn' | 'king' | 'bishop' | 'knight';

export type CellCords = [number, number];

export interface FigurePosition {
  figure: FigureTypes;
  isAlly: boolean;
  position: CellCords;
}

export interface Move {
  move: [CellCords, CellCords];
  killed?: FigureTypes;
}

export interface Puzzle {
  data: FigurePosition;
  puzzle: Move[];
}
