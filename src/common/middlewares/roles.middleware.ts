import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import type { NextFunction, Response } from 'express';
import { RolUsuario } from '../../auth/entities/usuario.entity.js';
import type { AuthenticatedRequest } from './auth.middleware.js';

@Injectable()
export class RolesMiddleware implements NestMiddleware {
  use(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
    const user = req.user;

    if (!user?.rol) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    const method = req.method.toUpperCase();

    const rolesPermitidosPorMetodo: Record<string, RolUsuario[]> = {
      GET: [RolUsuario.ADMIN, RolUsuario.CONSULTA],
      POST: [RolUsuario.ADMIN],
      PATCH: [RolUsuario.ADMIN],
      PUT: [RolUsuario.ADMIN],
      DELETE: [RolUsuario.ADMIN],
    };

    const rolesPermitidos = rolesPermitidosPorMetodo[method] ?? [
      RolUsuario.ADMIN,
    ];

    if (!rolesPermitidos.includes(user.rol)) {
      throw new ForbiddenException(
        `El rol ${user.rol} no tiene permiso para realizar esta operación`,
      );
    }

    next();
  }
}
