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
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BlogFilter } from './dto/blog-filter';

@ApiTags('Blogs')
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  getAllBlogs(@Query() filter: BlogFilter) {
    return this.blogService.findAll(filter);
  }

  @Get(':id')
  getBlogById(@Param('id') id: string) {
    return this.blogService.findOne(Number(id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  createBlog(@Body() data: CreateBlogDto, @Req() req) {
    const userId = req.user.userId;
    return this.blogService.create(data, userId as number);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateBlog(@Param('id') id: string, @Body() data: CreateBlogDto) {
    return this.blogService.update(Number(id), data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(Number(id));
  }
}
