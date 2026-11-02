import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';

describe('API Empleados & Auth (e2e)', () => {
  let app: INestApplication<App>;
  let adminToken: string;
  let consultaToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    const adminLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ usuario: 'admin', password: 'Admin123!' })
      .expect(200);
    adminToken = adminLogin.body.access_token;

    const consultaLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ usuario: 'consulta', password: 'Consulta123!' })
      .expect(200);
    consultaToken = consultaLogin.body.access_token;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/auth/login', () => {
    it('responde 401 con credenciales inválidas y formato de error estandarizado', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ usuario: 'admin', password: 'incorrecta' })
        .expect(401);

      expect(res.body).toMatchObject({
        statusCode: 401,
        path: '/api/auth/login',
      });
      expect(res.body.timestamp).toBeDefined();
    });
  });

  describe('Protección JWT y Roles en /api/empleados', () => {
    it('responde 401 sin token', async () => {
      await request(app.getHttpServer()).get('/api/empleados').expect(401);
    });

    it('responde 401 con token inválido', async () => {
      await request(app.getHttpServer())
        .get('/api/empleados')
        .set('Authorization', 'Bearer token_invalido')
        .expect(401);
    });

    it('permite consultar empleados a ADMIN y CONSULTA (mínimo 5 empleados mock)', async () => {
      const resConsulta = await request(app.getHttpServer())
        .get('/api/empleados')
        .set('Authorization', `Bearer ${consultaToken}`)
        .expect(200);

      expect(Array.isArray(resConsulta.body)).toBe(true);
      expect(resConsulta.body.length).toBeGreaterThanOrEqual(5);
      expect(resConsulta.body[0]).toHaveProperty('estado');
      expect(resConsulta.body[0]).not.toHaveProperty('activo');
    });

    it('responde 403 cuando CONSULTA intenta registrar o cambiar estado', async () => {
      await request(app.getHttpServer())
        .post('/api/empleados')
        .set('Authorization', `Bearer ${consultaToken}`)
        .send({
          nombreCompleto: 'Nuevo Empleado',
          area: 'TECNOLOGIA',
          puesto: 'QA Engineer',
          genero: 'FEMENINO',
          fechaEntrada: '2025-02-10',
          fechaNacimiento: '1996-05-12',
        })
        .expect(403);

      await request(app.getHttpServer())
        .patch('/api/empleados/1/estado')
        .set('Authorization', `Bearer ${consultaToken}`)
        .expect(403);
    });
  });

  describe('POST /api/empleados y PATCH /api/empleados/:id/estado (ADMIN)', () => {
    it('responde 400 cuando faltan campos o tienen valores inválidos', async () => {
      await request(app.getHttpServer())
        .post('/api/empleados')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombreCompleto: 'Empleado Incompleto',
          area: 'AREA_NO_VALIDA',
        })
        .expect(400);
    });

    it('crea un empleado como Activo (201) y aparece en GET /api/empleados', async () => {
      const nuevo = {
        nombreCompleto: 'Laura Patricia Méndez',
        area: 'FINANZAS',
        puesto: 'Contadora General',
        genero: 'FEMENINO',
        fechaEntrada: '2025-03-01',
        fechaNacimiento: '1992-08-25',
      };

      const createRes = await request(app.getHttpServer())
        .post('/api/empleados')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(nuevo)
        .expect(201);

      expect(createRes.body).toMatchObject({
        ...nuevo,
        id: 6,
        estado: 'Activo',
      });
      expect(createRes.body).not.toHaveProperty('activo');

      const listRes = await request(app.getHttpServer())
        .get('/api/empleados')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(listRes.body).toContainEqual(createRes.body);
    });

    it('activa/desactiva un empleado existente y devuelve 404 si no existe', async () => {
      const patchRes = await request(app.getHttpServer())
        .patch('/api/empleados/1/estado')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(patchRes.body.estado).toBe('Inactivo');

      const patchBackRes = await request(app.getHttpServer())
        .patch('/api/empleados/1/estado')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(patchBackRes.body.estado).toBe('Activo');

      await request(app.getHttpServer())
        .patch('/api/empleados/999/estado')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
});
