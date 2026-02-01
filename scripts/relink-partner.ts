
import prisma from '../lib/prisma'

async function main() {
  const email = 'christon9128@hotmail.com'
  const coupleId = 'cml12pxwy0000yc1ytibui4ti'

  console.log(`Relinking ${email} to Couple ID: ${coupleId}`)

  // 1. Find the user
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    console.error(`User ${email} not found`)
    return
  }

  // 2. Update the user
  const updatedUser = await prisma.user.update({
    where: { email },
    data: { coupleId: coupleId }
  })

  console.log(`Successfully relinked user ${updatedUser.email} (ID: ${updatedUser.id}) to couple ${updatedUser.coupleId}`)
  
  // Verify couple members
  const coupleUsers = await prisma.user.findMany({
    where: { coupleId }
  })
  
  console.log('--- Current Couple Members ---')
  coupleUsers.forEach(u => console.log(`${u.name} (${u.email})`))
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
