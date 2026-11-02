import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateEmpleadoDto } from './dto/create-empleado.dto.js';
import { UpdateEstadoEmpleadoDto } from './dto/update-estado-empleado.dto.js';
import { EmpleadosService } from './empleados.service.js';
import { Empleado } from './entities/empleado.entity.js';

@ApiTags('Empleados')
@ApiBearerAuth()
@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}

  @Get()
  @ApiOperation({
    summary: 'Lista todos los empleados',
    description: 'Acceso permitido para roles `ADMIN` y `CONSULTA`.',
  })
  @ApiOkResponse({
    description: 'Lista de empleados obtenida correctamente.',
    type: [Empleado],
  })
  @ApiUnauthorizedResponse({
    description: 'Sin token, token inválido o expirado (401).',
  })
  findAll() {
    return this.empleadosService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registra un nuevo empleado',
    description:
      'Acceso exclusivo para rol `ADMIN`. Crea el empleado con estado `Activo`.',
  })
  @ApiBody({ type: CreateEmpleadoDto })
  @ApiCreatedResponse({
    description: 'Empleado registrado exitosamente (201).',
    type: Empleado,
  })
  @ApiBadRequestResponse({
    description: 'Campos faltantes o con valores inválidos (400).',
  })
  @ApiUnauthorizedResponse({
    description: 'Sin token, token inválido o expirado (401).',
  })
  @ApiForbiddenResponse({
    description: 'Rol sin permiso para registrar empleados (403).',
  })
  create(@Body() createEmpleadoDto: CreateEmpleadoDto) {
    return this.empleadosService.create(createEmpleadoDto);
  }

  @Patch(':id/estado')
  @ApiOperation({
    summary: 'Activa o desactiva un empleado',
    description:
      'Acceso exclusivo para rol `ADMIN`. Actualiza el campo `estado` ("Activo" / "Inactivo"). Si no se envía body, alterna el estado actual.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del empleado',
    example: 1,
  })
  @ApiBody({
    type: UpdateEstadoEmpleadoDto,
    required: false,
  })
  @ApiOkResponse({
    description: 'Estado del empleado actualizado correctamente (200).',
    type: Empleado,
  })
  @ApiUnauthorizedResponse({
    description: 'Sin token, token inválido o expirado (401).',
  })
  @ApiForbiddenResponse({
    description: 'Rol sin permiso para cambiar el estado (403).',
  })
  @ApiNotFoundResponse({
    description: 'El empleado especificado no existe (404).',
  })
  updateEstado(
    @Param('id') id: string,
    @Body() updateEstadoDto?: UpdateEstadoEmpleadoDto,
  ) {
    return this.empleadosService.updateEstado(id, updateEstadoDto);
  }
}
