export enum RolUsuario {
  ADMIN = 'ADMIN',
  CONSULTA = 'CONSULTA',
}

export class Usuario {
  id: number;
  usuario: string;
  password: string;
  rol: RolUsuario;
}

export interface JwtPayload {
  sub: number;
  usuario: string;
  rol: RolUsuario;
  iat?: number;
  exp?: number;
}
