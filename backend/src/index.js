import express from 'express';
import cors from 'cors';
import { Queue } from 'bullmq';
import { readFile } from 'fs/promises';
import path from 'path';
import { OpenAI } from 'openai';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379')
};
const transcriptsDir = process.env.TRANSCRIPTS_DIR || path.join(process.cwd(), 'worker', 'transcripts');
const queue = new Queue('audio-jobs', { connection });

const app = express();
app.use(cors());
app.use(express.json());

app.post('/jobs', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'url requerida' });
  try {
    const job = await queue.add('process', { url });
    res.json({ id: job.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo crear el job' });
  }
});

app.post('/chat', async (req, res) => {
  const { id, question } = req.body;
  if (!id || !question) return res.status(400).json({ error: 'id y pregunta requeridos' });
  try {
    const transcript = await readFile(path.join(transcriptsDir, `${id}.txt`), 'utf8');
    if (!process.env.OPENAI_API_KEY) {
      return res.json({ answer: 'OPENAI_API_KEY no configurada' });
    }
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Responde preguntas sobre el siguiente texto' },
        { role: 'user', content: `${question}\n\nTexto:\n${transcript}` }
      ]
    });
    res.json({ answer: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: 'Transcripción no encontrada' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Backend escuchando en ${port}`));
