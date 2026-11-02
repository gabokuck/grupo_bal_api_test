import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { NextFunction, Request, Response } from 'express';
import type { JwtPayload } from '../../auth/entities/usuario.entity.js';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  use(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token de autenticación no proporcionado');
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        'Formato de autorización inválido. Use: Bearer <token>',
      );
    }

    try {
      const secret =
        this.configService.get<string>('JWT_SECRET') ??
        'grupo_bal_super_secret_jwt_key_2026';
      const payload = this.jwtService.verify<JwtPayload>(token, { secret });
      req.user = payload;
      next();
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
