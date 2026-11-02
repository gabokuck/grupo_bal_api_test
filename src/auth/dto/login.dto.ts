import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @Transform(({ value, obj }) => value ?? obj?.username)
  @IsString({ message: 'El campo usuario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El campo usuario es obligatorio' })
  usuario: string;

  @Transform(
    ({ value, obj }) => value ?? obj?.contraseña ?? obj?.contrasena,
  )
  @IsString({ message: 'El campo password debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El campo password es obligatorio' })
  password: string;
}
