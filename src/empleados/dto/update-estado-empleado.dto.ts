import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadoEmpleado } from '../entities/empleado.entity.js';

export class UpdateEstadoEmpleadoDto {
  @ApiPropertyOptional({
    description:
      'Nuevo estado del empleado ("Activo" o "Inactivo"). Si no se envía, se alterna automáticamente el estado actual.',
    enum: EstadoEmpleado,
    example: EstadoEmpleado.INACTIVO,
  })
  @IsOptional()
  @IsEnum(EstadoEmpleado, {
    message: 'estado debe ser "Activo" o "Inactivo"',
  })
  estado?: EstadoEmpleado;
}
