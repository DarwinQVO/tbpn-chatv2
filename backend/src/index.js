import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/jobs', (req, res) => {
  const id = Math.floor(Math.random() * 10000);
  // TODO: encolar job en BullMQ
  res.json({ id });
});

app.post('/chat', async (req, res) => {
  // TODO: implementar consulta a pgvector y GPT-4o
  res.json({ answer: 'Pendiente de implementar' });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Backend escuchando en ${port}`));
