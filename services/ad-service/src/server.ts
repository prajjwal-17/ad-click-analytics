import Fastify from "fastify";
import { prisma } from "./db";
import { adRoutes } from "./routes/ads";

const app = Fastify({ logger: true });

app.register(adRoutes);

app.get("/health", async () => {
  const advertisers = await prisma.advertiser.count();

  return {
    status: "ok",
    database: "connected",
    advertisers,
  };
});

app.listen({
  port: Number(process.env.PORT) || 3000,
  host: "0.0.0.0",
});