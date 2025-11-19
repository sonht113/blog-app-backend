import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ResponseUtil } from 'src/exceptions/utils/response';
import { BlogFilter } from './dto/blog-filter';

const authorSelect = {
  id: true,
  name: true,
  email: true,
  avatar: true,
};

const blogSelect = {
  id: true,
  title: true,
  content: true,
  thumbnail: true,
  createdAt: true,
  updatedAt: true,
  author: { select: authorSelect },
  category: { select: { id: true, name: true } },
};

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async findAll(filter: BlogFilter) {
    const { page, limit, keyword } = filter || {};
    const where = keyword
      ? {
          OR: [
            {
              title: { contains: keyword, mode: 'insensitive' as const },
            },
            {
              content: {
                contains: keyword,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : undefined;

    // no pagination -> return all matches
    if (page == null && limit == null) {
      const items = await this.prisma.blog.findMany({
        where,
        select: blogSelect,
        orderBy: { createdAt: 'desc' },
      });
      const meta = {
        total: items.length,
        totalPages: 1,
        page: null,
        limit: null,
      };
      return ResponseUtil.success('Blogs retrieved successfully', {
        items,
        meta,
      });
    }

    // pagination path
    const take = Math.max(1, Math.min(Number(limit) || 10, 100));
    const currentPage = Math.max(1, Number(page) || 1);
    const skip = (currentPage - 1) * take;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.blog.findMany({
        where,
        select: blogSelect,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.blog.count({ where }),
    ]);

    const totalPages = Math.ceil(total / take);
    const meta = { total, totalPages, page: currentPage, limit: take };

    return ResponseUtil.success('Blogs retrieved successfully', {
      items,
      meta,
    });
  }

  async findOne(id: number) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
      select: blogSelect,
    });
    return ResponseUtil.success('Blog retrieved successfully', blog);
  }

  async create(data: CreateBlogDto, userId: number) {
    try {
      const blog = await this.prisma.blog.create({
        data: {
          title: data.title,
          content: data.content,
          thumbnail: data.thumbnail,
          author: { connect: { id: userId } },
          category: { connect: { id: data.categoryId } },
        },
        select: blogSelect,
      });
      return ResponseUtil.success('Blog created successfully', blog);
    } catch {
      return ResponseUtil.error('Failed to create blog');
    }
  }

  async update(id: number, data: UpdateBlogDto) {
    try {
      const blog = await this.prisma.blog.update({
        where: { id },
        data,
        select: blogSelect,
      });
      return ResponseUtil.success('Blog updated successfully', blog);
    } catch {
      return ResponseUtil.error('Failed to update blog');
    }
  }

  async remove(id: number) {
    try {
      const blog = await this.prisma.blog.delete({
        where: { id },
        select: blogSelect,
      });
      return ResponseUtil.success('Blog deleted successfully', blog);
    } catch {
      return ResponseUtil.error('Failed to delete blog');
    }
  }
}
