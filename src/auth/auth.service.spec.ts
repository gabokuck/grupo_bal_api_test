import { UnauthorizedException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module.js';
import { AuthService } from './auth.service.js';
import { JwtPayload, RolUsuario } from './entities/usuario.entity.js';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('debe autenticar al usuario admin y devolver un token JWT con rol ADMIN', () => {
    const result = service.login({
      usuario: 'admin',
      password: 'Admin123!',
    });

    expect(result).toEqual({ token: expect.any(String) });
    const decoded = jwtService.decode<JwtPayload>(result.token);
    expect(decoded.rol).toBe(RolUsuario.ADMIN);
  });

  it('debe autenticar al usuario consulta y devolver un token JWT con rol CONSULTA', () => {
    const result = service.login({
      usuario: 'consulta',
      password: 'Consulta123!',
    });

    expect(result).toEqual({ token: expect.any(String) });
    const decoded = jwtService.decode<JwtPayload>(result.token);
    expect(decoded.rol).toBe(RolUsuario.CONSULTA);
  });

  it('debe lanzar UnauthorizedException con credenciales incorrectas', () => {
    expect(() =>
      service.login({
        usuario: 'admin',
        password: 'wrong-password',
      }),
    ).toThrow(UnauthorizedException);
  });
});
