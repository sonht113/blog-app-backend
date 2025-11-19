import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard bảo vệ các route yêu cầu người dùng phải đăng nhập.
 * Khi gắn @UseGuards(JwtAuthGuard), Nest sẽ tự động:
 * - Lấy token từ Authorization header (Bearer <token>)
 * - Kiểm tra chữ ký và hạn của token
 * - Giải mã payload (gồm sub, email, role, ...)
 * - Gán thông tin user vào req.user
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
