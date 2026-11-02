# Examen Técnico NestJS — API de Administración de Empleados

API REST desarrollada con **NestJS** y **TypeScript** para el registro y administración de empleados en memoria, con autenticación **JWT**, control de acceso por roles (**ADMIN**, **CONSULTA**), validaciones con `class-validator`, middlewares propios y documentación interactiva con **Swagger (OpenAPI)**.

---

## 1. Versiones utilizadas

- **Node.js**: `>= 22.x` (probado en `v24.x` / `v26.x`)
- **Framework**: **NestJS** `v12.0.1` (`@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`)
- **Lenguaje**: **TypeScript** `v6.0.2`

---

## 2. Instrucciones para ejecutar el proyecto

1. **Ubicarse en el directorio del proyecto**:
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

### Scripts disponibles
- `npm run start:dev` — Inicia el servidor en modo desarrollo con recarga automática (`--watch`).
- `npm run build` — Compila el proyecto TypeScript.
- `npm test` — Ejecuta las pruebas unitarias con Vitest.
- `npm run test:e2e` — Ejecuta las pruebas de integración (E2E).
- `npm run lint` — Ejecuta el linter (`oxlint`).

---

## 3. Documentación interactiva con Swagger (OpenAPI)

Con el servidor en ejecución, la documentación interactiva de la API está disponible en:

- **Swagger UI**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **Especificación OpenAPI (JSON)**: [http://localhost:3000/api/docs-json](http://localhost:3000/api/docs-json)

### Cómo probar los endpoints desde Swagger UI
1. Abre `http://localhost:3000/api/docs` en el navegador.
2. En la sección **Autenticación**, despliega `POST /api/auth/login`, haz clic en **Try it out** y ejecuta la petición con el usuario `admin` (`Admin123!`) o `consulta` (`Consulta123!`).
3. Copia el valor de `"token"` de la respuesta:
   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
   ```
4. Haz clic en el botón **Authorize** (arriba a la derecha), pega el token en el campo **Value** y presiona **Authorize**.
5. Ahora puedes ejecutar directamente desde Swagger cualquiera de los endpoints protegidos en la sección **Empleados** (`GET /api/empleados`, `POST /api/empleados` y `PATCH /api/empleados/{id}/estado`).

---

## 4. Estructura del proyecto

El proyecto sigue una arquitectura modular donde cada módulo agrupa su `controller`, `service`, `module`, `dto` y `entities`:

```text
src/
├── main.ts                                  # Punto de entrada, prefijo global /api y configuración de Swagger
├── app.module.ts                            # Módulo raíz, registro de middlewares, ValidationPipe y filtro global
├── auth/                                    # Módulo de Autenticación
│   ├── auth.module.ts                       # Configuración de JwtModule con clave desde .env
│   ├── auth.controller.ts                   # Endpoint POST /api/auth/login documentado con Swagger
│   ├── auth.service.ts                      # Usuarios mock y emisión de token JWT
│   ├── dto/
│   │   └── login.dto.ts                     # Validación y esquemas Swagger de entrada/salida de login
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

## 5. Dependencias principales

| Paquete | Propósito |
| --- | --- |
| `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express` | Núcleo del framework NestJS y servidor HTTP Express |
| `@nestjs/jwt` | Generación y verificación de tokens JWT |
| `@nestjs/config` | Carga de variables de entorno desde archivo `.env` |
| `class-validator` | Validación declarativa de DTOs de entrada |
| `class-transformer` | Transformación de payloads a instancias de DTO |
| `@nestjs/swagger` | Generación de especificación OpenAPI y Swagger UI en `/api/docs` |

---

## 6. Usuarios Mock

| Usuario | Contraseña | Rol | Permisos |
| --- | --- | --- | --- |
| `admin` | `Admin123!` | `ADMIN` | Consultar, registrar y activar/desactivar empleados |
| `consulta` | `Consulta123!` | `CONSULTA` | Solo consultar empleados (`GET /api/empleados`) |

---

## 7. Resumen de Endpoints

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| `POST` | `/api/auth/login` | Público | Inicia sesión y devuelve `{ "token": "<JWT>" }`. |
| `GET` | `/api/empleados` | `ADMIN`, `CONSULTA` | Lista todos los empleados. |
| `POST` | `/api/empleados` | `ADMIN` | Registra un empleado como `"Activo"` (`201`). |
| `PATCH` | `/api/empleados/:id/estado` | `ADMIN` | Activa o desactiva un empleado (`"Activo"` / `"Inactivo"`). |

---

## 8. Ejemplos de peticiones (`curl`)

### 8.1 Iniciar sesión como `ADMIN` (`POST /api/auth/login`)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "admin",
    "password": "Admin123!"
  }'
```
**Respuesta (`200 OK`)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 8.2 Iniciar sesión como `CONSULTA` (`POST /api/auth/login`)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "consulta",
    "password": "Consulta123!"
  }'
```

### 8.3 Listar empleados (`GET /api/empleados` — Roles: `ADMIN`, `CONSULTA`)
```bash
curl -X GET http://localhost:3000/api/empleados \
  -H "Authorization: Bearer <TU_TOKEN_JWT>"
```

### 8.4 Registrar un empleado (`POST /api/empleados` — Rol: `ADMIN`)
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
**Respuesta (`201 Created`)**:
```json
{
  "id": 6,
  "nombreCompleto": "Roberto Sánchez Díaz",
  "area": "TECNOLOGIA",
  "puesto": "Arquitecto de Software",
  "genero": "MASCULINO",
  "fechaEntrada": "2025-03-10",
  "fechaNacimiento": "1990-05-14",
  "estado": "Activo"
}
```

### 8.5 Activar / desactivar empleado (`PATCH /api/empleados/:id/estado` — Rol: `ADMIN`)

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
