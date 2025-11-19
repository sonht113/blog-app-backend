import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentFilter } from './dto/comment-filter';
import { ResponseUtil } from 'src/exceptions/utils/response';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

const commentSelect = {
  id: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
    },
  },
};

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async findAll(filter: CommentFilter) {
    const { page, limit, blog } = filter || {};

    if (!blog) {
      throw new BadRequestException('blog is required');
    }

    const where = { blogId: +blog };
    // No pagination -> return all comments for the blog
    if (page == null && limit == null) {
      const items = await this.prisma.comment.findMany({
        where,
        select: commentSelect,
        orderBy: { createdAt: 'desc' },
      });

      const total = items.length;
      const meta = { total, totalPages: 1, page: null, limit: null };

      return { items, meta };
    }

    // Pagination path (sanitize and cap)
    const take = Math.max(1, Math.min(Number(limit) || 10, 100));
    const currentPage = Math.max(1, Number(page) || 1);
    const skip = (currentPage - 1) * take;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.comment.findMany({
        where,
        select: commentSelect,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.comment.count({ where }),
    ]);

    const totalPages = Math.ceil(total / take);
    const meta = { total, totalPages, page: currentPage, limit: take };

    return ResponseUtil.success('Comments retrieved successfully', {
      items,
      meta,
    });
  }

  async findOne(id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      select: commentSelect,
    });
    if (!comment) {
      throw new BadRequestException('Comment not found');
    }
    return ResponseUtil.success('Comment retrieved successfully', comment);
  }

  async create(data: CreateCommentDto, userId: number, blogId: number) {
    try {
      const comment = await this.prisma.comment.create({
        data: {
          content: data.content,
          authorId: userId,
          blogId: blogId,
        },
        select: commentSelect,
      });
      return ResponseUtil.success('Comment created successfully', comment);
    } catch {
      throw new BadRequestException('Failed to create comment');
    }
  }

  async update(id: number, data: UpdateCommentDto) {
    try {
      const comment = await this.prisma.comment.update({
        where: { id },
        data: {
          content: data.content,
        },
        select: commentSelect,
      });
      return ResponseUtil.success('Comment updated successfully', comment);
    } catch {
      throw new BadRequestException('Failed to update comment');
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.comment.delete({
        where: { id },
      });
      return ResponseUtil.success('Comment deleted successfully', null);
    } catch {
      throw new BadRequestException('Failed to delete comment');
    }
  }
}
