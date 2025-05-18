import { Worker } from 'bullmq';
import { exec } from 'child_process';
import { readFile, writeFile } from 'fs/promises';

const connection = { host: 'localhost', port: 6379 };

const jobWorker = new Worker('audio-jobs', async job => {
  const { url } = job.data;
  // TODO: resolver URL y descargar audio con yt-dlp
  // TODO: transcribir con Deepgram Nova-3
  // TODO: almacenar transcript en Supabase Storage
  console.log('Procesando', url);
}, { connection });

console.log('Worker iniciado');
