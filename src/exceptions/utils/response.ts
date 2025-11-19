import { ApiResponseDto } from '../dto/response.dto';

export class ResponseUtil {
  static success<T = any>(
    message: string,
    data?: T,
    statusCode = 200,
  ): ApiResponseDto<T> {
    return {
      status: 'success',
      message,
      data,
      statusCode,
    };
  }

  static error(message: string, statusCode = 500): ApiResponseDto<null> {
    return {
      status: 'error',
      message,
      statusCode,
    };
  }
}
