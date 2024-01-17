import { IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional({ always: true })
  @MinLength(5)
  @MaxLength(16)
  username: string;

  @IsOptional({ always: true })
  @MinLength(2)
  firstName: string;

  @IsOptional({ always: true })
  @MinLength(2)
  lastName: string;

  @IsOptional({ always: true })
  @MaxLength(300)
  description: string;
}

export class getSolvedDto {
  @IsOptional({
    always: true,
  })
  page: number;
  @IsOptional({
    always: true,
  })
  limit: number;
}
