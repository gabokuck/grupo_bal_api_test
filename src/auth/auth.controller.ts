import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto, LoginResponseDto } from './dto/login.dto.js';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Inicia sesión y obtiene un token JWT',
    description:
      'Usuarios de prueba: `admin` / `Admin123!` (rol ADMIN) y `consulta` / `Consulta123!` (rol CONSULTA).',
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'Autenticación exitosa. Devuelve el token JWT.',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada faltantes o inválidos (400).',
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciales inválidas (401).',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
