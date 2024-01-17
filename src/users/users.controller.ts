import {
  Controller,
  Get,
  UseGuards,
  Request,
  Param,
  Put,
  Body,
  Query,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdateProfileDto, getSolvedDto } from './dto/updateProfile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { StorageService } from 'src/storage/storage.service';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private config: ConfigService,
    private storage: StorageService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getUsers(@Request() req) {
    return this.userService.getUserById(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async postImage(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.userService.uploadAvatar(req.user.userId, file);
  }

  @Get('stats/:id')
  getStats(@Param('id') id: string) {
    return this.userService.getStatsById(Number(id));
  }

  @Get('solved/:id')
  getSolved(@Param('id') id: string, @Query() dto: getSolvedDto) {
    return this.userService.getSolvedById(Number(id), dto.page, dto.limit);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  @UseInterceptors(FileInterceptor('avatar'))
  async updateProfile(
    @Request() req,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      await this.userService.uploadAvatar(req.user.userId, file);
    }
    return this.userService.putUser(req.user.userId, dto);
  }
}
