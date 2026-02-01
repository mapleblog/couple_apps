
import prisma from '../lib/prisma'

async function main() {
  const email = 'tkgoh228@gmail.com'
  console.log(`Checking user: ${email}`)

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
    console.log('User not found')
    return
  }

  console.log('User found:', {
    id: user.id,
    email: user.email,
    name: user.name,
    coupleId: user.coupleId,
  })

  if (user.couple) {
    console.log('Couple details:', {
      id: user.couple.id,
      createdAt: user.couple.createdAt,
      users: user.couple.users.map(u => ({ id: u.id, email: u.email, name: u.name }))
    })
  } else {
    console.log('User has no couple linked.')
  }
  
  // Also check if there are other users in the DB to potentially link with
  const allUsers = await prisma.user.findMany({
    take: 5
  })
  console.log('--- All Users Preview ---')
  allUsers.forEach(u => console.log(`${u.email} (ID: ${u.id}, Couple: ${u.coupleId})`))
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
