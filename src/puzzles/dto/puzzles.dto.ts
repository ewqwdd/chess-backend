import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  Validate,
  ValidateNested,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

class CellCords {
  constructor(public coordinates: [number, number]) {}
}

@ValidatorConstraint({ name: 'isValidCoordinates', async: false })
export class IsValidCoordinates implements ValidatorConstraintInterface {
  validate(value: any) {
    const [x, y] = value;

    // Добавьте здесь свои собственные условия валидации координат
    return typeof x === 'number' && typeof y === 'number';
  }

  defaultMessage() {
    return 'Position must be an array of two numbers.';
  }
}

export enum FigureTypes {
  KING = 'king',
  QUEEN = 'queen',
  BISHOP = 'bishop',
  KNIGHT = 'knight',
  ROOK = 'rook',
  PAWN = 'pawn',
}

class FigurePosition {
  @IsEnum(FigureTypes)
  figure: FigureTypes;

  @IsBoolean()
  isAlly: boolean;

  @Type(() => CellCords)
  @Validate(IsValidCoordinates)
  position: CellCords;
}

class Move {
  @IsArray()
  move: [CellCords, CellCords];

  @IsEnum(FigureTypes)
  @IsOptional({
    always: true,
  })
  killed?: FigureTypes;
}

export class PuzzleDto {
  @ValidateNested({ each: true })
  @Type(() => FigurePosition)
  board: FigurePosition[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Move)
  puzzle: Move[];
}
