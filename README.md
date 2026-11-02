# Examen Técnico NestJS — API de Administración de Empleados

API REST desarrollada con **NestJS** y **TypeScript** para el registro y administración de empleados en memoria, con autenticación **JWT**, control de acceso por roles (**ADMIN**, **CONSULTA**), validaciones con `class-validator` y middlewares propios.

---

## 1. Versiones utilizadas

- **Node.js**: `>= 22.x` (probado en `v24.x` / `v26.x`)
- **Framework**: **NestJS** `v12.0.1` (`@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`)
- **Lenguaje**: **TypeScript** `v6.0.2`

---

## 2. Instrucciones para ejecutar el proyecto

1. **Clonar o ubicarse en el directorio del proyecto**:
   ```bash
   cd grupo_bal_api_test
   ```

2. **Configurar variables de entorno**:
   Copia el archivo `.env.example` a `.env` (si aún no existe):
   ```bash
   cp .env.example .env
   ```

3. **Instalar dependencias e iniciar el servidor en modo desarrollo**:
   ```bash
   npm install
   npm run start:dev
   ```

El servidor iniciará por defecto en `http://localhost:3000`.

### Scripts adicionales
- `npm run build` — Compila el proyecto TypeScript.
- `npm test` — Ejecuta las pruebas unitarias con Vitest.
- `npm run test:e2e` — Ejecuta las pruebas de integración (E2E).
- `npm run lint` — Ejecuta el linter (`oxlint`).

---

## 3. Estructura del proyecto

El proyecto sigue una arquitectura modular donde cada módulo agrupa su `controller`, `service`, `module`, `dto` y `entities`:

```text
src/
├── main.ts                                  # Punto de entrada y prefijo global /api
├── app.module.ts                            # Módulo raíz, registro de middlewares, ValidationPipe y filtro global
├── auth/                                    # Módulo de Autenticación
│   ├── auth.module.ts                       # Configuración de JwtModule con clave desde .env
│   ├── auth.controller.ts                   # Endpoint POST /api/auth/login (sin lógica de negocio)
│   ├── auth.service.ts                      # Usuarios mock y emisión de token JWT
│   ├── dto/
│   │   └── login.dto.ts                     # Validación de credenciales de entrada
│   └── entities/
│       └── usuario.entity.ts                # Modelo Usuario y enum RolUsuario (ADMIN, CONSULTA)
├── empleados/                               # Módulo de Empleados
│   ├── empleados.module.ts                  # Agrupa EmpleadosController y EmpleadosService
│   ├── empleados.controller.ts              # Recibe peticiones GET, POST y PATCH y delega al service
│   ├── empleados.service.ts                 # Lógica de negocio y arreglo en memoria (5 empleados mock iniciales)
│   ├── dto/
│   │   ├── create-empleado.dto.ts           # Validación de campos obligatorios, enums y fechas YYYY-MM-DD
│   │   └── update-estado-empleado.dto.ts    # Validación opcional para cambio de estado
│   └── entities/
│       └── empleado.entity.ts               # Modelo Empleado y enums Area, Genero y EstadoEmpleado
└── common/                                  # Middlewares y manejo de errores propios
    ├── middlewares/
    │   ├── logger.middleware.ts             # Muestra en consola método, ruta, código HTTP y tiempo en ms
    │   ├── auth.middleware.ts               # Valida encabezado Authorization: Bearer <token> (401)
    │   └── roles.middleware.ts              # Valida permisos según rol ADMIN / CONSULTA (403)
    └── filters/
        └── http-exception.filter.ts         # Estandariza el formato JSON de todos los errores
```

---

## 4. Dependencias principales

| Paquete | Propósito |
| --- | --- |
| `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express` | Núcleo del framework NestJS y servidor HTTP Express |
| `@nestjs/jwt` | Generación y verificación de tokens JWT |
| `@nestjs/config` | Carga de variables de entorno desde archivo `.env` |
| `class-validator` | Validación declarativa de DTOs de entrada |
| `class-transformer` | Transformación de payloads a instancias de DTO |

---

## 5. Usuarios Mock

| Usuario | Contraseña | Rol | Permisos |
| --- | --- | --- | --- |
| `admin` | `Admin123!` | `ADMIN` | Consultar, registrar y activar/desactivar empleados |
| `consulta` | `Consulta123!` | `CONSULTA` | Solo consultar empleados (`GET /api/empleados`) |

---

## 6. Ejemplos de peticiones (`curl`)

### 6.1 Iniciar sesión como `ADMIN` (`POST /api/auth/login`)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "admin",
    "password": "Admin123!"
  }'
```

### 6.2 Iniciar sesión como `CONSULTA` (`POST /api/auth/login`)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "consulta",
    "password": "Consulta123!"
  }'
```

### 6.3 Listar empleados (`GET /api/empleados` — Roles: `ADMIN`, `CONSULTA`)
```bash
curl -X GET http://localhost:3000/api/empleados \
  -H "Authorization: Bearer <TU_TOKEN_JWT>"
```

### 6.4 Registrar un empleado (`POST /api/empleados` — Rol: `ADMIN`)
```bash
curl -X POST http://localhost:3000/api/empleados \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_ADMIN>" \
  -d '{
    "nombreCompleto": "Roberto Sánchez Díaz",
    "area": "TECNOLOGIA",
    "puesto": "Arquitecto de Software",
    "genero": "MASCULINO",
    "fechaEntrada": "2025-03-10",
    "fechaNacimiento": "1990-05-14"
  }'
```

### 6.5 Activar / desactivar empleado (`PATCH /api/empleados/:id/estado` — Rol: `ADMIN`)

Alternar automáticamente entre `"Activo"` e `"Inactivo"`:
```bash
curl -X PATCH http://localhost:3000/api/empleados/1/estado \
  -H "Authorization: Bearer <TOKEN_ADMIN>"
```

O especificando explícitamente el nuevo estado en el body:
```bash
curl -X PATCH http://localhost:3000/api/empleados/1/estado \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_ADMIN>" \
  -d '{
    "estado": "Inactivo"
  }'
```
