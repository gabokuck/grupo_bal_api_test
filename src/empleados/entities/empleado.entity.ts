import { ApiProperty } from '@nestjs/swagger';

export enum Area {
  TECNOLOGIA = 'TECNOLOGIA',
  RECURSOS_HUMANOS = 'RECURSOS_HUMANOS',
  FINANZAS = 'FINANZAS',
  OPERACIONES = 'OPERACIONES',
  VENTAS = 'VENTAS',
  ADMINISTRACION = 'ADMINISTRACION',
}

export enum Genero {
  MASCULINO = 'MASCULINO',
  FEMENINO = 'FEMENINO',
  OTRO = 'OTRO',
}

export enum EstadoEmpleado {
  ACTIVO = 'Activo',
  INACTIVO = 'Inactivo',
}

export class Empleado {
  @ApiProperty({
    description: 'Identificador único generado por el servidor',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre completo del empleado',
    example: 'Carlos Alberto Ramírez Gómez',
  })
  nombreCompleto: string;

  @ApiProperty({
    description: 'Área a la que pertenece el empleado',
    enum: Area,
    example: Area.TECNOLOGIA,
  })
  area: Area;

  @ApiProperty({
    description: 'Puesto del empleado',
    example: 'Desarrollador Backend Senior',
  })
  puesto: string;

  @ApiProperty({
    description: 'Género del empleado',
    enum: Genero,
    example: Genero.MASCULINO,
  })
  genero: Genero;

  @ApiProperty({
    description: 'Fecha de entrada a la empresa (YYYY-MM-DD)',
    example: '2022-03-15',
  })
  fechaEntrada: string;

  @ApiProperty({
    description: 'Fecha de nacimiento del empleado (YYYY-MM-DD)',
    example: '1991-07-20',
  })
  fechaNacimiento: string;

  @ApiProperty({
    description: 'Estado actual del empleado',
    enum: EstadoEmpleado,
    example: EstadoEmpleado.ACTIVO,
  })
  estado: EstadoEmpleado;
}
