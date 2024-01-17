import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PuzzleDto } from './dto/puzzles.dto';

@Injectable()
export class PuzzlesService {
  constructor(private prisma: PrismaService) {}

  async getPuzzle(userId: number) {
    const puzzle = await this.prisma.puzzle
      .findFirst({
        where: {
          solved: {
            none: {
              userId,
            },
          },
        },
      })
      .catch(() => {
        return null;
      });
    if (!puzzle) return null;
    let parsed = puzzle.puzzle;
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
    }
    return { ...parsed, id: puzzle.id };
  }

  async postPuzzle(dto: PuzzleDto) {
    const puzzle = await this.prisma.puzzle.create({
      data: {
        puzzle: JSON.stringify(dto),
      },
    });
    return puzzle;
  }

  async getPuzzleById(id: number) {
    const puzzle = await this.prisma.puzzle
      .findFirst({
        where: {
          id,
        },
      })
      .catch(() => {
        return null;
      });
    if (!puzzle) return null;
    let parsed = puzzle.puzzle;
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
    }
    return { ...parsed, id: puzzle.id };
  }

  async completePuzzle(id: number, userId: number, time: number) {
    await this.prisma.solved.create({
      data: {
        user: {
          connect: {
            id: Number(userId),
          },
        },
        puzzle: {
          connect: {
            id: Number(id),
          },
        },
        time,
      },
    });
    return;
  }
}
