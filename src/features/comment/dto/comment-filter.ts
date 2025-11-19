import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Pageable } from 'src/common/pageable';

export class CommentFilter extends Pageable {
  @ApiProperty({ example: '1', required: true })
  @IsNotEmpty()
  @IsString()
  blog: string;
}
