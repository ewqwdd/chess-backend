import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  async getUserById(id: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
    try {
      const file = this.storage.root.children.find(
        (elem) => elem.name === user.avatar,
      );
      if (file) {
        const link = await file.link({});
        user.avatar = link;
      }
    } catch (err) {
      console.log(err);
    }

    return user;
  }

  async getStatsById(id: number) {
    const puzzles = await this.prisma.solved.findMany({
      where: {
        userId: id,
      },
      select: {
        time: true,
      },
    });

    const solved = puzzles?.length ?? 1;
    const avgTime =
      (puzzles?.reduce((acc, elem) => acc + elem.time, 0) ?? 0) / solved;
    return {
      solved,
      avgTime,
    };
  }

  async getSolvedById(id: number, page?: number, limit?: number) {
    const skip = page ? (page - 1) * limit : undefined;
    const take = limit ? Number(limit) : undefined;
    const count = await this.prisma.solved.count({
      where: {
        user: {
          id,
        },
      },
    });
    const puzzles = await this.prisma.puzzle.findMany({
      where: {
        solved: {
          some: {
            user: {
              id,
            },
          },
        },
      },
      take: take,
      skip: skip,
    });
    let pages = count;
    if (limit) {
      pages = Math.round(count / limit);
    }

    return { puzzles, pages };
  }

  async putUser(id: number, data: UpdateProfileDto) {
    const updated = await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });

    return updated;
  }

  async uploadAvatar(id: number, file: Express.Multer.File) {
    const uploadStream = await this.storage.upload(
      {
        name: file.originalname,
      },
      file.buffer,
    );
    let res;
    uploadStream.on('complete', async (file) => {
      res = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          avatar: file.name,
        },
      });
    });
    uploadStream.on('error', (error) => {
      throw new Error(error);
    });
    return res;
  }
}
