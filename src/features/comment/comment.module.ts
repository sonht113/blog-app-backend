import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [CommentController],
  providers: [CommentService, PrismaService],
  exports: [],
})
export class CommentModule {}
