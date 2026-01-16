import { buildServer } from './server';
import 'dotenv/config';

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

async function start() {
  try {
    const server = await buildServer();

    await server.listen({ port: PORT, host: HOST });

    console.log(`
🚀 LoCo Backend Server is running!

  ➜ Local:   http://localhost:${PORT}
  ➜ Network: http://${HOST}:${PORT}
  ➜ Health:  http://localhost:${PORT}/health
  ➜ API:     http://localhost:${PORT}/api/v1

  Environment: ${process.env.NODE_ENV || 'development'}
    `);

    // Graceful shutdown
    const signals = ['SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        console.log(`\nReceived ${signal}, shutting down gracefully...`);
        await server.close();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

start();
