# 🦷 Backend - Sistema Ferreyra & Panozzo Odontología

Backend completo para sistema de gestión odontológica desarrollado con Node.js, Express y Firebase Firestore.

## 📋 Índice

- [Características](#características)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Seguridad](#seguridad)
- [Scripts](#scripts)
- [Backup y Restauración](#backup-y-restauración)

## ✨ Características

- ✅ Autenticación JWT con bcrypt
- ✅ Arquitectura MVC con capa de servicios
- ✅ Validación de datos robusta
- ✅ Rate limiting y sanitización de inputs
- ✅ Gestión de usuarios, turnos y tratamientos
- ✅ Control de acceso basado en roles (RBAC)
- ✅ Prevención de conflictos de horarios
- ✅ Sistema de backup/restore de Firestore
- ✅ Manejo centralizado de errores
- ✅ Logging de seguridad
- ✅ CORS configurado
- ✅ Headers de seguridad

## 🏗️ Arquitectura

El proyecto sigue una arquitectura en capas con patrón MVC:

```
┌─────────────────┐
│   Controllers   │  ← Manejo de peticiones HTTP
├─────────────────┤
│    Services     │  ← Lógica de negocio
├─────────────────┤
│     Models      │  ← Acceso a datos (Firebase)
├─────────────────┤
│   Middleware    │  ← Autenticación, validación, seguridad
└─────────────────┘
```

## 🛠️ Tecnologías

- **Runtime**: Node.js >= 18.0.0
- **Framework**: Express 4.x
- **Base de Datos**: Firebase Firestore
- **Autenticación**: JWT + bcrypt
- **Validación**: Custom validators
- **Seguridad**: express-rate-limit, sanitización
- **Logging**: Morgan
- **Gestión de env**: dotenv

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <url-del-repo>

# Navegar al directorio
cd agubackend

# Instalar dependencias
npm install

# Copiar archivo de configuración
cp .env.example .env
```

## ⚙️ Configuración

### 1. Variables de entorno (.env)

```env
PORT=3000
NODE_ENV=development

# Firebase
GOOGLE_APPLICATION_CREDENTIALS=./firebase.json

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRES_IN=24h

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 2. Firebase

Coloca tu archivo `firebase.json` con las credenciales de Firebase Admin SDK en la raíz del proyecto.

## 🚀 Uso

```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start

# Backup de base de datos
npm run backup

# Restaurar base de datos
npm run restore
```

## 📡 API Endpoints

### Autenticación (`/api/auth`)

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| POST | `/register` | Registrar usuario | No |
| POST | `/login` | Iniciar sesión | No |
| POST | `/logout` | Cerrar sesión | Sí |
| GET | `/profile` | Obtener perfil | Sí |
| GET | `/verify` | Verificar token | Sí |

### Usuarios (`/api/users`)

| Método | Ruta | Descripción | Rol |
|--------|------|-------------|-----|
| GET | `/` | Listar usuarios | Profesional |
| GET | `/:id` | Obtener usuario | Profesional |
| GET | `/role/:role` | Filtrar por rol | Profesional |
| GET | `/active` | Usuarios activos | Profesional |
| DELETE | `/:id` | Eliminar usuario | Profesional |

### Turnos (`/api/appointments`)

| Método | Ruta | Descripción | Rol |
|--------|------|-------------|-----|
| GET | `/` | Listar turnos | Profesional |
| GET | `/:id` | Obtener turno | Ambos |
| GET | `/user/:userId` | Turnos de usuario | Ambos |
| GET | `/date/:date` | Turnos por fecha | Profesional |
| POST | `/` | Crear turno | Profesional |
| PUT | `/:id` | Actualizar turno | Profesional |
| PATCH | `/:id/state` | Cambiar estado | Profesional |
| DELETE | `/:id` | Eliminar turno | Profesional |

### Tratamientos (`/api/treatments`)

| Método | Ruta | Descripción | Rol |
|--------|------|-------------|-----|
| GET | `/` | Listar tratamientos | Público |
| GET | `/:id` | Obtener tratamiento | Público |
| POST | `/` | Crear tratamiento | Profesional |
| PUT | `/:id` | Actualizar tratamiento | Profesional |
| DELETE | `/:id` | Eliminar tratamiento | Profesional |

## 📂 Estructura del Proyecto

```
agubackend/
├── src/
│   ├── config/
│   │   └── firebase.js              # Configuración Firebase
│   ├── controllers/
│   │   ├── authController.js        # Controlador autenticación
│   │   ├── userController.js        # Controlador usuarios
│   │   ├── appointmentController.js # Controlador turnos
│   │   └── treatmentController.js   # Controlador tratamientos
│   ├── services/
│   │   ├── authService.js           # Lógica de autenticación
│   │   ├── userService.js           # Lógica de usuarios
│   │   ├── appointmentService.js    # Lógica de turnos
│   │   └── treatmentService.js      # Lógica de tratamientos
│   ├── models/
│   │   ├── userModel.js             # Modelo de usuarios
│   │   ├── appointmentModel.js      # Modelo de turnos
│   │   └── treatmentModel.js        # Modelo de tratamientos
│   ├── middlewares/
│   │   ├── authMiddleware.js        # Verificación JWT
│   │   ├── roleMiddleware.js        # Control de roles
│   │   ├── errorHandler.js          # Manejo de errores
│   │   └── security.js              # Seguridad y rate limiting
│   ├── routes/
│   │   ├── authRoutes.js            # Rutas de autenticación
│   │   ├── userRoutes.js            # Rutas de usuarios
│   │   ├── appointmentRoutes.js     # Rutas de turnos
│   │   └── treatmentRoutes.js       # Rutas de tratamientos
│   ├── utils/
│   │   ├── constants.js             # Constantes del sistema
│   │   ├── helpers.js               # Funciones auxiliares
│   │   └── validators.js            # Validadores
│   ├── app.js                       # Configuración Express
│   ├── index.js                     # Punto de entrada
│   └── firestore-backup.js          # Sistema de backup
├── .env                             # Variables de entorno
├── .gitignore
├── firebase.json                    # Credenciales Firebase
├── package.json
└── README.md
```

## 🔒 Seguridad

### Implementaciones de seguridad:

1. **Autenticación JWT**: Tokens con expiración configurable
2. **Hashing de contraseñas**: bcrypt con 12 rounds
3. **Rate Limiting**:
   - Login: 5 intentos / 15 min
   - Registro: 3 intentos / hora
   - API General: 100 req / 15 min
4. **Sanitización**: Limpieza de inputs para prevenir inyecciones NoSQL
5. **Headers de seguridad**:
   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff
   - X-XSS-Protection
   - Referrer-Policy
   - Content-Security-Policy
6. **CORS**: Configurado con orígenes permitidos
7. **Control de acceso basado en roles**
8. **Logging de seguridad**: Registro de operaciones sensibles

## 📜 Scripts

```bash
# Iniciar en producción
npm start

# Iniciar en desarrollo (con nodemon)
npm run dev

# Hacer backup de Firestore
npm run backup

# Restaurar desde backup
npm run restore
```

## 💾 Backup y Restauración

### Realizar backup

```bash
npm run backup
```

Crea archivos JSON en `/backups` con timestamp:
- `users_2024-10-30T10-30-00.json`
- `appointments_2024-10-30T10-30-00.json`
- `treatments_2024-10-30T10-30-00.json`

### Restaurar backup completo

```bash
npm run restore
```

Restaura todas las colecciones desde los archivos más recientes.

### Restaurar archivo específico

```bash
node src/firestore-backup.js restore users_2024-10-30T10-30-00.json
```

## 🔑 Roles de Usuario

### `user` (Usuario/Paciente)
- Ver sus propios turnos
- Ver tratamientos disponibles

### `professional` (Profesional/Admin)
- Todas las operaciones de usuarios
- Gestión completa de turnos
- Gestión completa de tratamientos
- Ver reportes y estadísticas

## 📝 Modelos de Datos

### Usuario
```json
{
  "id": "string",
  "name": "string",
  "lastname": "string",
  "email": "string",
  "password": "string (hash)",
  "phone": "string",
  "birthdate": "Date",
  "role": "user | professional",
  "state": "sessionStarted | closedSession",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Turno
```json
{
  "id": "string",
  "date": "string (YYYY-MM-DD)",
  "startTime": "string (HH:MM)",
  "endTime": "string (HH:MM)",
  "userId": "string",
  "treatmentId": "string",
  "notes": "string",
  "state": "pending | confirmed | completed | cancelled",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Tratamiento
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "duration": "number (minutos)",
  "image": "string (URL)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## 🐛 Debugging

Para ver logs detallados en desarrollo:

```bash
NODE_ENV=development npm run dev
```

Esto mostrará:
- Peticiones HTTP (Morgan)
- Errores con stack trace
- Logs de seguridad
- Operaciones de base de datos

## 🤝 Buenas Prácticas Implementadas

- ✅ Separación de responsabilidades (MVC + Services)
- ✅ DRY (Don't Repeat Yourself)
- ✅ SOLID principles
- ✅ Clean Code
- ✅ Manejo centralizado de errores
- ✅ Validaciones exhaustivas
- ✅ Código documentado con JSDoc
- ✅ Convenciones de nomenclatura consistentes
- ✅ Async/await para operaciones asíncronas
- ✅ Try/catch en todas las operaciones
- ✅ Respuestas estandarizadas

## 📄 Licencia

ISC

## 👥 Contacto

Ferreyra & Panozzo - Odontología General

---

Desarrollado con ❤️ siguiendo las mejores prácticas de desarrollo backend