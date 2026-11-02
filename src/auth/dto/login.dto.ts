import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { RolUsuario } from '../entities/usuario.entity.js';

export class LoginDto {
  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'admin',
  })
  @Transform(({ value, obj }) => value ?? obj?.username)
  @IsString({ message: 'El campo usuario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El campo usuario es obligatorio' })
  usuario: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Admin123!',
  })
  @Transform(
    ({ value, obj }) => value ?? obj?.contraseña ?? obj?.contrasena,
  )
  @IsString({ message: 'El campo password debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El campo password es obligatorio' })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'Token JWT para enviar en Authorization: Bearer <token>',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Alias del token JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;

  @ApiProperty({ example: 'admin' })
  usuario: string;

  @ApiProperty({ enum: RolUsuario, example: RolUsuario.ADMIN })
  rol: RolUsuario;
}
