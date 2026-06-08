import { z } from "zod";

const prismaUniqueError = z.object({ code: z.literal("P2002") });

export function isDuplicateKey(err: unknown): boolean {
	return prismaUniqueError.safeParse(err).success;
}
