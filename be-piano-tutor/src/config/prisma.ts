import { PrismaClient } from '@prisma/client';

// Create an instance of the PrismaClient
// This client can be imported and used across your application to query the database.
const prisma = new PrismaClient();

export default prisma;
