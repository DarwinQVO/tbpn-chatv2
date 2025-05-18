import { Worker } from 'bullmq';
import { createWriteStream } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { pipeline } from 'stream';
import { YtDlpWrap } from 'yt-dlp-wrap';
import { Deepgram } from '@deepgram/sdk';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379')
};
const downloadsDir = process.env.DOWNLOADS_DIR || path.join(process.cwd(), 'downloads');
const transcriptsDir = process.env.TRANSCRIPTS_DIR || path.join(process.cwd(), 'transcripts');

await mkdir(downloadsDir, { recursive: true });
await mkdir(transcriptsDir, { recursive: true });

const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY || '');
const ytDlp = new YtDlpWrap();

const jobWorker = new Worker('audio-jobs', async job => {
  const { url } = job.data;
  const id = job.id;
  console.log('Procesando', url);
  try {
    const audioPath = path.join(downloadsDir, `${id}.mp3`);
    await new Promise((resolve, reject) => {
      const stream = ytDlp.execStream([url, '-x', '--audio-format', 'mp3', '-o', '-']);
      const ws = createWriteStream(audioPath);
      pipeline(stream, ws, err => (err ? reject(err) : resolve()));
    });

    const audioData = await readFile(audioPath);
    const resp = await deepgram.transcription.preRecorded(
      { buffer: audioData, mimetype: 'audio/mpeg' },
      { model: 'nova-3' }
    );
    const transcript = resp.results.channels[0].alternatives[0].transcript;
    await writeFile(path.join(transcriptsDir, `${id}.txt`), transcript);
    console.log('Transcripción lista', id);
  } catch (err) {
    console.error('Error procesando job', id, err);
  }
}, { connection });

console.log('Worker iniciado');
