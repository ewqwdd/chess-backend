import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PuzzlesService } from './puzzles.service';
import { Request } from '@nestjs/common';
import { PuzzleDto } from './dto/puzzles.dto';
import { completePuzzleDto } from './dto/completePuzzle.dto';

@Controller('puzzles')
export class PuzzlesController {
  constructor(private puzzleService: PuzzlesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getPuzzles(@Request() req) {
    return this.puzzleService.getPuzzle(req.user.id);
  }

  @Get(':id')
  getPuzzleById(@Param('id') id: string) {
    return this.puzzleService.getPuzzleById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  postPuzzle(@Body(new ValidationPipe()) puzzleDto: PuzzleDto) {
    return this.puzzleService.postPuzzle(puzzleDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('complete/:id')
  completePuzzle(
    @Request() req,
    @Param('id') id: number,
    @Body() dto: completePuzzleDto,
  ) {
    return this.puzzleService.completePuzzle(
      id,
      req.user.userId,
      Number(dto.time),
    );
  }
}
