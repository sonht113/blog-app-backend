export class ApiResponseDto<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  statusCode?: number;
}
