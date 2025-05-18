# Audio-Text Tool

Este repositorio contiene una aplicación web de ejemplo para transformar audio de videos o podcasts en una base de conocimiento consultable por chat. El proyecto está dividido en tres carpetas principales:

- `frontend`: aplicación React (Next.js 14) con interfaz minimalista de tema oscuro.
- `backend`: servidor Express.js con API REST y un endpoint de chat.
- `worker`: proceso independiente con BullMQ para descargar y transcribir audios.

## Requisitos

- Node.js 18+
- PostgreSQL y Supabase con la extensión `pgvector` habilitada.
- Redis para las colas de BullMQ.

## Uso básico

```bash
# instalar dependencias
npm install

# iniciar frontend y backend en modo desarrollo
npm run dev

# en otra terminal, iniciar el worker
npm run dev -w worker
```

`npm run build` compilará todos los paquetes, incluido el worker.

Consulta la documentación de cada paquete en su carpeta correspondiente para más detalles.

El despliegue está pensado para Railway.app utilizando las variables de entorno necesarias (`DEEPGRAM_API_KEY`, `OPENAI_API_KEY`, entre otras).

## Despliegue

Al hacer push a la rama `main`, Railway desplegará automáticamente el frontend, backend y worker siguiendo la configuración de `package.json`. Asegúrate de definir las variables de entorno requeridas en el panel de Railway.
