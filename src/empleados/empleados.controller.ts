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
import { CreateEmpleadoDto } from './dto/create-empleado.dto.js';
import { UpdateEstadoEmpleadoDto } from './dto/update-estado-empleado.dto.js';
import { EmpleadosService } from './empleados.service.js';

@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}

  @Get()
  findAll() {
    return this.empleadosService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEmpleadoDto: CreateEmpleadoDto) {
    return this.empleadosService.create(createEmpleadoDto);
  }

  @Patch(':id/estado')
  updateEstado(
    @Param('id') id: string,
    @Body() updateEstadoDto?: UpdateEstadoEmpleadoDto,
  ) {
    return this.empleadosService.updateEstado(id, updateEstadoDto);
  }
}
