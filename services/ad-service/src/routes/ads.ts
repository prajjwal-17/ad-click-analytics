import { FastifyInstance } from "fastify";
import { prisma } from "../db";
import { randomUUID } from "crypto";
import { signImpression } from "../utils/signature";


export async function adRoutes(app: FastifyInstance) {
  app.get("/ads/serve", async (request, reply) => {
    const { placement } = request.query as {
      placement?: string;
    };

    if (!placement) {
      return reply.code(400).send({
        error: "placement is required",
      });
    }

    const ads = await prisma.ad.findMany({
      where: {
        placement,
        status: "ACTIVE",
        campaign: {
          status: "ACTIVE",
        },
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        redirectUrl: true,
        placement: true,
      },
    });

    if (ads.length === 0) {
      return reply.code(404).send({
        error: "No eligible ad found",
      });
    }

    const ad = ads[Math.floor(Math.random() * ads.length)];

const impressionId = randomUUID();

return {
  ad: {
    ...ad,
    id: ad.id.toString(),
  },
  impression: {
    id: impressionId,
    signature: signImpression(ad.id, impressionId),
  },
};
  });
}