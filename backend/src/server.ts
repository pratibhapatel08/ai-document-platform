import app from "./app";
import { connectDB } from "./config/db";
import { connectRedis, disconnectRedis } from "./lib/redis";
import { env } from "./config/env";

const startServer = async (): Promise<void> => {
  await connectDB();
  await connectRedis();

  const server = app.listen(env.PORT, () => {
    console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    console.log(`API docs available at http://localhost:${env.PORT}/api/docs`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`${signal} received — shutting down gracefully`);
    server.close(async () => {
      await disconnectRedis();
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));
};

startServer().catch((error: unknown) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
