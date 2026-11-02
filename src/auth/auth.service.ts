import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto.js';
import { JwtPayload, RolUsuario, Usuario } from './entities/usuario.entity.js';

@Injectable()
export class AuthService {
  private readonly usuarios: Usuario[] = [
    {
      id: 1,
      usuario: 'admin',
      password: 'Admin123!',
      rol: RolUsuario.ADMIN,
    },
    {
      id: 2,
      usuario: 'consulta',
      password: 'Consulta123!',
      rol: RolUsuario.CONSULTA,
    },
  ];

  constructor(private readonly jwtService: JwtService) {}

  login(loginDto: LoginDto) {
    const user = this.usuarios.find(
      (u) =>
        u.usuario === loginDto.usuario && u.password === loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload: JwtPayload = {
      sub: user.id,
      usuario: user.usuario,
      rol: user.rol,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      token,
      usuario: user.usuario,
      rol: user.rol,
    };
  }
}
