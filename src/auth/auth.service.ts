import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signUp({ password, email }: AuthDto) {
    try {
      const hashed = bcrypt.hashSync(password, 6);

      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashed,
          username: nanoid(8),
        },
      });
      return await this.login(user);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('This email is taken');
        }
      }
    }
  }

  async validateUser(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: username,
      },
    });
    if (!user) {
      return null;
    }
    const pwMatch = bcrypt.compareSync(password, user.password);
    if (!pwMatch) {
      return null;
    }
    return user;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: await this.jwt.signAsync(payload, {
        expiresIn: '24h',
        secret: this.config.get('SECRET'),
      }),
    };
  }
}
