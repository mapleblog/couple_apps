
import prisma from '../lib/prisma'

async function main() {
  console.log('Listing all users...')
  const users = await prisma.user.findMany({
    take: 20,
    select: {
      id: true,
      email: true,
      name: true,
      coupleId: true
    }
  })

  users.forEach(u => {
    console.log(`User: ${u.email} | Name: ${u.name} | ID: ${u.id} | Couple: ${u.coupleId}`)
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
