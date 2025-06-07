import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
/**
 * Finds a user by a unique field (e.g., email or id).
 * Returns user data if found, otherwise null.
 *
 * @param {Object} where - Prisma filter for unique user lookup.
 * @returns {Object|null} The user object if found, otherwise null.
 */
export async function findUser(where) {
  return prisma.user.findUnique({ where });
}
