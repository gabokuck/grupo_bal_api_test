import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { Area, Genero } from '../entities/empleado.entity.js';

function IsValidCalendarDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidCalendarDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return false;
          }
          const [year, month, day] = value.split('-').map(Number);
          const date = new Date(Date.UTC(year, month - 1, day));
          return (
            date.getUTCFullYear() === year &&
            date.getUTCMonth() === month - 1 &&
            date.getUTCDate() === day
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} debe ser una fecha válida con formato YYYY-MM-DD`;
        },
      },
    });
  };
}

export class CreateEmpleadoDto {
  @ApiProperty({
    description: 'Nombre completo del empleado',
    example: 'Roberto Sánchez Díaz',
  })
  @IsString({ message: 'nombreCompleto debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'nombreCompleto es obligatorio' })
  nombreCompleto: string;

  @ApiProperty({
    description: 'Área de asignación del empleado',
    enum: Area,
    example: Area.TECNOLOGIA,
  })
  @IsEnum(Area, {
    message: `area debe ser uno de los siguientes valores: ${Object.values(Area).join(', ')}`,
  })
  @IsNotEmpty({ message: 'area es obligatoria' })
  area: Area;

  @ApiProperty({
    description: 'Puesto o cargo del empleado',
    example: 'Arquitecto de Software',
  })
  @IsString({ message: 'puesto debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'puesto es obligatorio' })
  puesto: string;

  @ApiProperty({
    description: 'Género del empleado',
    enum: Genero,
    example: Genero.MASCULINO,
  })
  @IsEnum(Genero, {
    message: `genero debe ser uno de los siguientes valores: ${Object.values(Genero).join(', ')}`,
  })
  @IsNotEmpty({ message: 'genero es obligatorio' })
  genero: Genero;

  @ApiProperty({
    description: 'Fecha de entrada en formato YYYY-MM-DD',
    example: '2025-03-10',
  })
  @IsString({ message: 'fechaEntrada debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'fechaEntrada es obligatoria' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'fechaEntrada debe tener el formato YYYY-MM-DD',
  })
  @IsValidCalendarDate()
  fechaEntrada: string;

  @ApiProperty({
    description: 'Fecha de nacimiento en formato YYYY-MM-DD',
    example: '1990-05-14',
  })
  @IsString({ message: 'fechaNacimiento debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'fechaNacimiento es obligatoria' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'fechaNacimiento debe tener el formato YYYY-MM-DD',
  })
  @IsValidCalendarDate()
  fechaNacimiento: string;
}
