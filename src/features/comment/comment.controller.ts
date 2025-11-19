import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CommentFilter } from './dto/comment-filter';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async findAll(@Query() filter: CommentFilter) {
    return this.commentService.findAll(filter);
  }

  @Get(':id')
  getCommentById(@Param('id') id: string) {
    return this.commentService.findOne(Number(id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':blogId')
  createComment(
    @Param('blogId') blogId: string,
    @Body() data: CreateCommentDto,
    @Req() req,
  ) {
    const userId = req.user.userId;
    return this.commentService.create(data, userId as number, +blogId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateComment(@Param('id') id: string, @Body() data: CreateCommentDto) {
    return this.commentService.update(Number(id), data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(Number(id));
  }
}
