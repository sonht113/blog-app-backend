import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class Pageable {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({
    required: false,
    example: 1,
    description: 'Page number',
  })
  page?: number = 1;

  @IsOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({
    required: false,
    example: 10,
    description: 'Number of items per page',
  })
  limit?: number = 10;
}
