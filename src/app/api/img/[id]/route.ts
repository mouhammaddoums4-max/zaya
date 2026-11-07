import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const media = await prisma.mediaImage.findUnique({ where: { id } });
  if (!media) {
    return new Response("Introuvable", { status: 404 });
  }

  const body = new Uint8Array(media.data);
  return new Response(body, {
    headers: {
      "Content-Type": media.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
