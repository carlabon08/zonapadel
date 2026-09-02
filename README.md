# ZonaPadel

ZonaPadel es una aplicacion para descubrir clubes, consultar canchas, administrar reservas y gestionar clases de padel. La interfaz funciona como web y como aplicacion movil mediante Capacitor.

## Arquitectura

```mermaid
graph LR
	A[App React / Capacitor] -->|HTTPS + JSON + JWT| B[API Express]
	B --> C[(MySQL)]
```

### Componentes

```mermaid
flowchart TB
	subgraph Cliente[Celular o navegador]
		UI[React + Vite]
		PWA[PWA / Capacitor Android]
		UI --> PWA
	end

	subgraph Servidor[Servidor de aplicacion]
		API[Express API]
		AUTH[JWT + bcryptjs]
		ROUTES[Rutas REST]
		DB_CLIENT[mysql2 pool]
		API --> AUTH
		API --> ROUTES
		ROUTES --> DB_CLIENT
	end

	subgraph Datos[Persistencia]
		MYSQL[(MySQL zonapadel)]
		TABLES[usuarios · clubes · canchas<br/>entrenador_clubes · reservas · clases]
		MYSQL --- TABLES
	end

	UI -->|HTTPS / JSON| API
	DB_CLIENT --> MYSQL
```

### Flujo del entrenador con varios clubes

```mermaid
sequenceDiagram
	participant T as Entrenador
	participant A as App movil
	participant API as API Express
	participant DB as MySQL

	T->>A: Inicia sesion una sola vez
	A->>API: POST /api/auth/login
	API->>DB: Busca usuario y verifica password
	DB-->>API: Usuario valido
	API-->>A: JWT
	T->>A: Marca Club Norte y Padel Arena
	A->>API: POST /api/clubes/entrenador/mis-clubes/:clubId
	API->>DB: Guarda relacion entrenador_clubes
	T->>A: Selecciona un club
	A->>API: GET /api/canchas?club_id=...
	API->>DB: Consulta canchas del club
	DB-->>API: Canchas, reservas y clases
	API-->>A: Datos filtrados del club activo
```

### Flujo del jugador

```mermaid
sequenceDiagram
	participant J as Jugador
	participant A as App movil
	participant API as API Express
	participant DB as MySQL

	J->>A: Se registra o inicia sesion
	A->>API: POST /api/auth/registro o /api/auth/login
	API->>DB: Crea o valida usuario
	DB-->>API: Usuario y credenciales validas
	API-->>A: JWT
	J->>A: Elige un club y consulta canchas
	A->>API: GET /api/clubes y GET /api/canchas?club_id=...
	API->>DB: Busca clubes y disponibilidad
	DB-->>API: Canchas y horarios
	API-->>A: Muestra opciones disponibles
	J->>A: Selecciona fecha, hora y cancha
	A->>API: POST /api/reservas con JWT
	API->>DB: Comprueba conflicto y guarda reserva
	DB-->>API: Reserva confirmada o conflicto
	API-->>A: Resultado de la reserva
```

El jugador puede consultar sus reservas, cancelar una reserva según las reglas del negocio y descubrir clases o partidos disponibles. La comprobación de disponibilidad ocurre en la API para evitar reservas duplicadas desde distintos celulares.

### Flujo del club

```mermaid
sequenceDiagram
	participant C as Usuario del club
	participant A as App movil
	participant API as API Express
	participant DB as MySQL

	C->>A: Inicia sesion como club
	A->>API: POST /api/auth/login
	API->>DB: Valida usuario y club asociado
	DB-->>API: Usuario autorizado
	API-->>A: JWT
	C->>A: Abre configuracion de canchas
	A->>API: GET /api/canchas?club_id=...
	API->>DB: Consulta canchas del club
	DB-->>API: Estado y horarios
	API-->>A: Muestra tablero de canchas
	C->>A: Cambia estado u horario de una cancha
	A->>API: PATCH /api/canchas/:id con JWT
	API->>DB: Actualiza cancha si tiene permisos
	DB-->>API: Cancha actualizada
	API-->>A: Confirma cambios
	C->>A: Revisa las reservas del club
	A->>API: GET /api/reservas?club_id=...
	API->>DB: Consulta reservas por cancha
	DB-->>API: Reservas y estados
	API-->>A: Muestra calendario y reservas
```

El rol `club` administra las canchas y visualiza las reservas de su entidad. Los cambios quedan guardados en MySQL y luego pueden ser consultados por jugadores y entrenadores mediante la API.

### Flujo de la persona organizadora de torneos

```mermaid
sequenceDiagram
	participant O as Organizador
	participant A as App movil
	participant API as API Express
	participant DB as MySQL

	O->>A: Inicia sesion como organizador
	A->>API: POST /api/auth/login
	API->>DB: Valida usuario con rol torneos
	DB-->>API: Usuario autorizado
	API-->>A: JWT
	O->>A: Consulta clubes y canchas disponibles
	A->>API: GET /api/clubes y GET /api/canchas?club_id=...
	API->>DB: Busca canchas y horarios
	DB-->>API: Disponibilidad actual
	API-->>A: Muestra canchas libres
	O->>A: Selecciona cancha, fecha y horario del torneo
	A->>API: POST /api/reservas con JWT
	API->>DB: Comprueba conflicto y bloquea horario
	DB-->>API: Reserva del torneo
	API-->>A: Confirma cancha bloqueada
	O->>A: Publica inscripciones y gestiona equipos
	A->>API: API de torneos (a incorporar)
	API->>DB: Guarda evento, equipos e inscripciones
```

El rol `torneos` puede consultar disponibilidad y bloquear canchas para un evento. Para completar la gestión de torneos, el modelo de datos deberá incorporar tablas como `torneos`, `equipos` e `inscripciones`; esas tablas todavía no forman parte del esquema inicial.

- **Celular:** contiene la interfaz React compilada. No necesita instalar MySQL.
- **API:** servidor Node.js + Express. Valida usuarios, permisos, clubes y conflictos de reservas.
- **Base de datos:** MySQL centralizado. Guarda usuarios, clubes, canchas, reservas y clases de forma persistente.
- **Autenticacion:** JWT. La app envia el token en `Authorization: Bearer <token>`.

La app movil nunca debe conectarse directamente a MySQL. Las credenciales de la base de datos permanecen en el servidor y el celular consume la API.

## Stack

- Frontend: React 18 + Vite
- Backend: Node.js + Express
- Base de datos: MySQL 9 (compatible con MySQL 8)
- Acceso a datos: `mysql2`
- Autenticacion: `jsonwebtoken` + `bcryptjs`
- Aplicacion movil: Capacitor Android y PWA
- Monorepo: npm workspaces

## Requisitos

- Node.js 20 LTS recomendado
- npm 10 o superior
- MySQL 8 o superior
- PowerShell en Windows, Terminal en macOS/Linux

Node 21 puede generar problemas con dependencias nativas opcionales de Vite/Rolldown. Para este proyecto se recomienda Node 20 LTS.

## Estructura principal

```text
apps/
	server/
		server.js                 # Servidor Express y montaje de rutas
		src/
			auth.js                 # JWT y middleware de permisos
			db.js                   # Pool de conexiones MySQL
			routes/
				auth.routes.js
				clubes.routes.js
				canchas.routes.js
				reservas.routes.js
				clases.routes.js
		sql/schema.sql            # Tablas y datos iniciales
	web/
		src/App.jsx               # Interfaz React
		src/index.css             # Sistema visual
```

## Instalacion

Desde la carpeta raiz del proyecto:

```powershell
cd C:\Users\carla\OneDrive\Documentos\zonapadel
npm install
```

## Configurar MySQL local

El servicio MySQL debe estar iniciado. En Windows puede verificarse con:

```powershell
Get-Service -Name "*mysql*"
```

Crear la base, las tablas y los clubes/canchas iniciales:

```powershell
mysql -u root -p < apps/server/sql/schema.sql
```

En PowerShell, si `mysql` no esta en el PATH, usar la ruta completa de la instalacion:

```powershell
& "C:\Program Files\MySQL\MySQL Server 9.0\bin\mysql.exe" -u root -p
```

Dentro del cliente MySQL:

```sql
source C:/ruta/al/proyecto/apps/server/sql/schema.sql;
```

El script crea la base `zonapadel`, sus tablas y tres clubes de prueba. Se puede ejecutar mas de una vez; los clubes existentes no se duplican.

## Variables de entorno

Copiar `apps/server/.env.example` como `apps/server/.env` y completar la contrasena de MySQL:

```powershell
Copy-Item apps/server/.env.example apps/server/.env
```

Contenido esperado:

```env
PORT=3003
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contrasena_de_mysql
DB_NAME=zonapadel
JWT_SECRET=un_secreto_largo_y_aleatorio
```

El archivo `.env` esta ignorado por Git. Nunca subir contrasenas ni secretos reales al repositorio.

## Levantar el proyecto

Desde la raiz:

```powershell
npm run dev
```

Direcciones locales:

- Frontend: `http://localhost:5173`
- API: `http://localhost:3003/api`
- Health check: `http://localhost:3003/api/health`

Para ejecutar solo el backend:

```powershell
npm run start
```

Si Vite informa `EPERM` al borrar `apps/web/node_modules/.vite`, cerrar procesos anteriores de Vite/Node y limpiar la carpeta:

```powershell
Remove-Item apps/web/node_modules/.vite -Recurse -Force
npm run dev
```

OneDrive puede bloquear archivos durante la sincronizacion. Para desarrollo frecuente conviene mantener el proyecto en una carpeta local que no sincronice OneDrive, por ejemplo `C:\dev\zonapadel`.

## API REST

### Publicos

```text
GET  /api/health
GET  /api/clubes
GET  /api/clubes/:id
GET  /api/canchas
GET  /api/canchas?club_id=club-padel-norte
```

### Autenticacion

```text
POST /api/auth/registro
POST /api/auth/login
```

Ejemplo de registro:

```json
{
	"nombre": "Martina Ruiz",
	"email": "martina@example.com",
	"password": "una-contrasena-segura",
	"rol": "entrenador"
}
```

Los roles disponibles son `jugador`, `club`, `entrenador` y `torneos`.

### Entrenadores y multiples clubes

Un entrenador inicia sesion una sola vez y se relaciona con varios clubes mediante la tabla puente `entrenador_clubes`:

```text
GET    /api/clubes/entrenador/mis-clubes
POST   /api/clubes/entrenador/mis-clubes/:clubId
DELETE /api/clubes/entrenador/mis-clubes/:clubId
```

La app muestra un check por cada club seleccionado. Luego el entrenador puede cambiar de club desde el selector y consultar sus canchas, reservas y clases asociadas.

### Reservas y clases

```text
GET   /api/reservas?club_id=club-padel-norte
POST  /api/reservas
PATCH /api/reservas/:id/estado

GET  /api/clases?club_id=club-padel-norte
POST /api/clases
```

Todas las rutas privadas requieren:

```text
Authorization: Bearer <token>
```

El backend rechaza una reserva cuando la misma cancha ya tiene una reserva activa para la fecha y hora solicitadas.

## Modelo de datos

- `usuarios`: cuentas, roles y contrasenas hasheadas.
- `clubes`: clubes disponibles.
- `canchas`: canchas pertenecientes a un club y su estado.
- `entrenador_clubes`: relacion muchos a muchos entre entrenadores y clubes.
- `reservas`: reservas de jugadores o entrenadores, con estado y horario.
- `clases`: clases creadas por entrenadores en un club y, opcionalmente, una cancha.

## Construir la web

```powershell
npm run build
```

El resultado queda en `apps/web/dist`.

## Uso en celular

### PWA

Para probarla en el celular, el frontend debe estar publicado por HTTPS. En Android o iPhone:

1. Abrir la URL publicada en el navegador.
2. Elegir **Agregar a pantalla de inicio** o **Instalar aplicacion**.

La PWA sigue consumiendo la API publicada, no una base de datos local.

### APK Android con Capacitor

Capacitor empaqueta la interfaz web como una app Android. MySQL sigue ejecutandose en el servidor y la app usa la URL publica de la API.

Para una version movil real hay que configurar la URL de produccion de la API, generar el build web y sincronizar Capacitor. Para publicar en iPhone se requiere macOS + Xcode.

## Produccion

En produccion se necesitan dos servicios:

1. **Frontend:** Vercel u otro hosting estatico.
2. **API + MySQL:** un servidor Node.js y una base MySQL accesibles desde internet, por ejemplo Railway, Render, un VPS o un proveedor administrado.

Configurar en produccion:

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y `DB_NAME` del proveedor MySQL.
- `JWT_SECRET` aleatorio y privado.
- URL HTTPS de la API en el frontend.
- CORS limitado al dominio real del frontend.
- Backups automaticos de MySQL.

No se debe exponer MySQL directamente a la app movil ni commitear archivos `.env`.

## Scripts

```powershell
npm run dev        # frontend y backend en desarrollo
npm run build      # build de produccion del frontend
npm run start      # solo backend
```

## Seguridad y mantenimiento

Antes de publicar:

```powershell
npm audit
```

Revisar cada vulnerabilidad antes de usar `npm audit fix --force`, porque puede actualizar Vite, Capacitor u otras dependencias principales y romper compatibilidad.
