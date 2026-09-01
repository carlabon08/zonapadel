# ZonaPadel

Aplicación para reservar canchas de pádel con una interfaz moderna y una API REST simple.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Persistencia: en memoria para la versión inicial

## Requisitos

- Node.js 18+
- npm 9+

## Instalación

```bash
npm install
npm run dev
```

## Uso

- Frontend: http://localhost:5173
- API: http://localhost:3001/api

## Scripts

```bash
npm run dev        # inicia frontend y backend
npm run build      # construye el frontend
npm run start      # inicia solo el backend
```

## Deploy en Vercel (frontend)

El repositorio ya incluye configuracion en `vercel.json` para publicar el frontend Vite del monorepo.

### Opcion A: Dashboard de Vercel

1. Crear proyecto en Vercel e importar este repositorio.
2. No cambiar comandos: Vercel toma los definidos en `vercel.json`.
3. Deploy.

### Opcion B: CLI de Vercel

```bash
npm install -g vercel
vercel login
vercel
vercel --prod
```

## Instalar en iPhone (PWA)

1. Abrir la URL de Vercel en Safari.
2. Tocar Compartir.
3. Tocar Anadir a pantalla de inicio.
4. Abrir ZonaPadel desde el icono en el inicio.

Nota: para publicar en App Store (IPA/TestFlight) se requiere Mac + Xcode.
