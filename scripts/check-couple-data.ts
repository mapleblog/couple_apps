
import prisma from '../lib/prisma'

async function main() {
  const email = 'christon9128@hotmail.com'
  console.log(`Simulating fetching couple data for: ${email}`)

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      couple: {
        include: {
          users: true
        }
      }
    }
  })

  if (!user) {
    console.error('User not found')
    return
  }

  if (!user.couple) {
    console.error('User has no couple data')
    return
  }

  console.log('Couple Data Retrieved:')
  user.couple.users.forEach(u => {
    console.log(`User: ${u.name} (${u.email})`)
    console.log(`- ID: ${u.id}`)
    console.log(`- Avatar URL: ${u.avatarUrl}`)
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
