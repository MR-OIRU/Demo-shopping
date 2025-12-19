import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ResponseFormat<T> {
  statusCode: number;
  message: string;
  data: T | null;
  meta?: PaginationMeta;
}

interface ResponseWithMessage {
  message?: string;
  data?: unknown;
  meta?: PaginationMeta;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseFormat<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data: T | ResponseWithMessage) => {
        const hasMessage = this.isResponseWithMessage(data);

        const result: ResponseFormat<T> = {
          statusCode: response.statusCode,
          message: hasMessage ? (data.message ?? 'Success') : 'Success',
          data: hasMessage ? ((data.data as T) ?? null) : data,
        };

        if (hasMessage && 'meta' in data) {
          const meta = data.meta;
          if (meta) {
            result.meta = meta;
          }
        }

        return result;
      }),
    );
  }

  private isResponseWithMessage(data: unknown): data is ResponseWithMessage {
    return typeof data === 'object' && data !== null && ('message' in data || 'data' in data);
  }
}
