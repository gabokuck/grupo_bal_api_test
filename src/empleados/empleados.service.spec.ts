import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EmpleadosService } from './empleados.service.js';
import {
  Area,
  EstadoEmpleado,
  Genero,
} from './entities/empleado.entity.js';

describe('EmpleadosService', () => {
  let service: EmpleadosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmpleadosService],
    }).compile();

    service = module.get<EmpleadosService>(EmpleadosService);
  });

  it('debe iniciar con al menos 5 empleados mock', () => {
    const empleados = service.findAll();
    expect(empleados.length).toBeGreaterThanOrEqual(5);
    for (const emp of empleados) {
      expect(emp).toHaveProperty('id');
      expect(emp).toHaveProperty('nombreCompleto');
      expect(emp).toHaveProperty('area');
      expect(emp).toHaveProperty('puesto');
      expect(emp).toHaveProperty('genero');
      expect(emp).toHaveProperty('fechaEntrada');
      expect(emp).toHaveProperty('fechaNacimiento');
      expect(emp).toHaveProperty('estado');
      expect(emp).not.toHaveProperty('activo');
    }
  });

  it('debe registrar un nuevo empleado con estado Activo', () => {
    const creado = service.create({
      nombreCompleto: 'Juan Pérez López',
      area: Area.ADMINISTRACION,
      puesto: 'Administrador General',
      genero: Genero.MASCULINO,
      fechaEntrada: '2025-01-15',
      fechaNacimiento: '1990-06-10',
    });

    expect(creado.id).toBe(6);
    expect(creado.estado).toBe(EstadoEmpleado.ACTIVO);
    expect(creado).not.toHaveProperty('activo');
    expect(service.findAll()).toContainEqual(creado);
  });

  it('debe alternar el estado del empleado y lanzar 404 si no existe', () => {
    const desactivado = service.updateEstado('1');
    expect(desactivado.estado).toBe(EstadoEmpleado.INACTIVO);

    const reactivado = service.updateEstado('1');
    expect(reactivado.estado).toBe(EstadoEmpleado.ACTIVO);

    expect(() => service.updateEstado('999')).toThrow(NotFoundException);
  });
});
