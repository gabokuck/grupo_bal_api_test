import { IsEnum, IsOptional } from 'class-validator';
import { EstadoEmpleado } from '../entities/empleado.entity.js';

export class UpdateEstadoEmpleadoDto {
  @IsOptional()
  @IsEnum(EstadoEmpleado, {
    message: 'estado debe ser "Activo" o "Inactivo"',
  })
  estado?: EstadoEmpleado;
}
