/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { PrismaClient } from '@repo/db/generated/prisma/client.js';
import { isProduction } from '@repo/utilities/misc';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ log: ['info', 'warn', 'error'] });

if (!isProduction()) globalForPrisma.prisma = prisma;

export default prisma;
