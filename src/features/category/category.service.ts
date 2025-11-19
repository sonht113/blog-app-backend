import { Injectable } from '@nestjs/common';
import { ResponseUtil } from 'src/exceptions/utils/response';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-catetory.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const categories = await this.prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return ResponseUtil.success('Categories fetched successfully', categories);
  }

  async create(data: CreateCategoryDto) {
    try {
      const category = await this.prisma.category.create({
        data: {
          name: data.name,
        },
      });
      return ResponseUtil.success('Category created successfully', category);
    } catch {
      return ResponseUtil.error('Failed to create category');
    }
  }

  async update(id: number, data: UpdateCategoryDto) {
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data: {
          name: data.name,
        },
      });
      return ResponseUtil.success('Category updated successfully', category);
    } catch {
      return ResponseUtil.error('Failed to update category');
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.category.delete({ where: { id } });
      return ResponseUtil.success('Category deleted successfully', null);
    } catch {
      return ResponseUtil.error('Failed to delete category');
    }
  }
}
