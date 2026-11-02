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
  id: number;
  nombreCompleto: string;
  area: Area;
  puesto: string;
  genero: Genero;
  fechaEntrada: string;
  fechaNacimiento: string;
  estado: EstadoEmpleado;
}
