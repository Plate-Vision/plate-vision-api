import { Request } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserEntity } from '@modules/user/domain/entities/user.entity';

export const AuthUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Omit<Request, 'user'> & { user: UserEntity }>();

    return request.user;
  },
);
