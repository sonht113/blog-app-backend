import { IsOptional, IsString } from 'class-validator';
import { Pageable } from 'src/common/pageable';
import { ApiProperty } from '@nestjs/swagger';

export class BlogFilter extends Pageable {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Title or content keyword of blog', required: false })
  keyword?: string;
}
