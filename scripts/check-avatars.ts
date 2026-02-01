
import prisma from '../lib/prisma'

async function main() {
  const email = 'tkgoh228@gmail.com'
  const partnerEmail = 'christon9128@hotmail.com'

  const users = await prisma.user.findMany({
    where: {
      email: {
        in: [email, partnerEmail]
      }
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true
    }
  })

  console.log('User Details:')
  users.forEach(u => {
    console.log(`- ${u.name} (${u.email})`)
    console.log(`  Avatar URL: ${u.avatarUrl || 'NULL/UNDEFINED'}`)
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
