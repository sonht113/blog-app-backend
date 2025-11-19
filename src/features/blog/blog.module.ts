import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [BlogController],
  providers: [BlogService, PrismaService],
  exports: [],
})
export class BlogModule {}
