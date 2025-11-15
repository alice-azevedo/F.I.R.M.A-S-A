
import 'dotenv/config';
import http from 'http';
import app from './app';

const PORT = Number(process.env.PORT || 4000);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`)
});
