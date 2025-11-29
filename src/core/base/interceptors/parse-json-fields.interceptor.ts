import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ParseJsonFieldsInterceptor implements NestInterceptor {
  constructor(private readonly fields: string[]) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.body) {
      this.fields.forEach((field) => {
        if (request.body[field] && typeof request.body[field] === 'string') {
          try {
            request.body[field] = JSON.parse(request.body[field]);
          } catch (error) {
            console.error(`Erro ao fazer parse do campo ${field}:`, error);
          }
        }
      });
    }

    return next.handle();
  }
}
