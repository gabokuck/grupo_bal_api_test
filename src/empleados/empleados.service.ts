import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmpleadoDto } from './dto/create-empleado.dto.js';
import { UpdateEstadoEmpleadoDto } from './dto/update-estado-empleado.dto.js';
import {
  Area,
  Empleado,
  EstadoEmpleado,
  Genero,
} from './entities/empleado.entity.js';

@Injectable()
export class EmpleadosService {
  private readonly empleados: Empleado[] = [
    {
      id: 1,
      nombreCompleto: 'Carlos Alberto Ramírez Gómez',
      area: Area.TECNOLOGIA,
      puesto: 'Desarrollador Backend Senior',
      genero: Genero.MASCULINO,
      fechaEntrada: '2022-03-15',
      fechaNacimiento: '1991-07-20',
      estado: EstadoEmpleado.ACTIVO,
    },
    {
      id: 2,
      nombreCompleto: 'María Fernanda López Hernández',
      area: Area.RECURSOS_HUMANOS,
      puesto: 'Especialista en Atracción de Talento',
      genero: Genero.FEMENINO,
      fechaEntrada: '2021-08-01',
      fechaNacimiento: '1994-11-05',
      estado: EstadoEmpleado.ACTIVO,
    },
    {
      id: 3,
      nombreCompleto: 'Alejandro Torres Vega',
      area: Area.FINANZAS,
      puesto: 'Analista Financiero',
      genero: Genero.MASCULINO,
      fechaEntrada: '2020-01-10',
      fechaNacimiento: '1988-04-12',
      estado: EstadoEmpleado.ACTIVO,
    },
    {
      id: 4,
      nombreCompleto: 'Valeria Morales Sánchez',
      area: Area.OPERACIONES,
      puesto: 'Coordinadora de Operaciones',
      genero: Genero.FEMENINO,
      fechaEntrada: '2023-05-22',
      fechaNacimiento: '1995-09-18',
      estado: EstadoEmpleado.INACTIVO,
    },
    {
      id: 5,
      nombreCompleto: 'Andrea Castillo Rivera',
      area: Area.VENTAS,
      puesto: 'Ejecutiva de Cuentas Clave',
      genero: Genero.OTRO,
      fechaEntrada: '2024-02-01',
      fechaNacimiento: '1997-01-30',
      estado: EstadoEmpleado.ACTIVO,
    },
  ];

  private nextId = 6;

  findAll(): Empleado[] {
    return this.empleados;
  }

  create(createEmpleadoDto: CreateEmpleadoDto): Empleado {
    const nuevoEmpleado: Empleado = {
      id: this.nextId++,
      nombreCompleto: createEmpleadoDto.nombreCompleto,
      area: createEmpleadoDto.area,
      puesto: createEmpleadoDto.puesto,
      genero: createEmpleadoDto.genero,
      fechaEntrada: createEmpleadoDto.fechaEntrada,
      fechaNacimiento: createEmpleadoDto.fechaNacimiento,
      estado: EstadoEmpleado.ACTIVO,
    };

    this.empleados.push(nuevoEmpleado);
    return nuevoEmpleado;
  }

  updateEstado(
    idParam: string,
    updateEstadoDto?: UpdateEstadoEmpleadoDto,
  ): Empleado {
    const id = Number(idParam);
    const empleado = Number.isInteger(id)
      ? this.empleados.find((item) => item.id === id)
      : undefined;

    if (!empleado) {
      throw new NotFoundException(`Empleado con id ${idParam} no encontrado`);
    }

    if (updateEstadoDto?.estado !== undefined) {
      empleado.estado = updateEstadoDto.estado;
    } else {
      empleado.estado =
        empleado.estado === EstadoEmpleado.ACTIVO
          ? EstadoEmpleado.INACTIVO
          : EstadoEmpleado.ACTIVO;
    }

    return empleado;
  }
}
