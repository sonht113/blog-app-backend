import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BlogModule } from './blog/blog.module';
import { CommentModule } from './comment/comment.module';
import { UploadModule } from './upload/upload.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    BlogModule,
    CategoryModule,
    CommentModule,
    UploadModule,
  ],
})
export class FeatureModule {}
