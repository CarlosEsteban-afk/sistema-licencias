const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.license.upsert({
    where: { folio: 'L-1001' },
    update: {},
    create: {
      folio: 'L-1001',
      patientId: '11111111-1',
      doctorId: 'D-123',
      diagnosis: 'cough',
      startDate: new Date(),
      days: 7,
      status: 'issued'
    }
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
