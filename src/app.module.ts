import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AuthModule } from './auth/auth.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { AuthMiddleware } from './common/middlewares/auth.middleware.js';
import { LoggerMiddleware } from './common/middlewares/logger.middleware.js';
import { RolesMiddleware } from './common/middlewares/roles.middleware.js';
import { EmpleadosController } from './empleados/empleados.controller.js';
import { EmpleadosModule } from './empleados/empleados.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    EmpleadosModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
      }),
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('{*path}');
    consumer
      .apply(AuthMiddleware, RolesMiddleware)
      .forRoutes(EmpleadosController);
  }
}
