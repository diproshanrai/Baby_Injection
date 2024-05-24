const { PrismaClient } = require('@prisma/client')
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      name: 'Admin',
      role: "ADMIN",
      password: await bcrypt.hash('password',10)
    },
  })

  const visitor = await prisma.user.upsert({
    where: { email: 'visitor@visitor.com' },
    update: {},
    create: {
      email: 'visitor@visitor.com',
      name: 'Visitor',
      role:"VISITOR",
      password: await bcrypt.hash('password',10)
    },
  })

  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@doctor.com' },
    update: {},
    create: {
      email: 'doctor@doctor.com',
      name: 'Doctor',
      role: "DOCTOR",
      password: await bcrypt.hash('password',10)
    },
  })
  
  console.log({ admin,visitor, doctor})
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })