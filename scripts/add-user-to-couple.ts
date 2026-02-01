
import prisma from '../lib/prisma'

async function main() {
  const userId = 'f027ccee-618c-47c8-8eab-6ddf63078876'
  const coupleId = 'cml12pxwy0000yc1ytibui4ti'

  console.log(`Adding User ID: ${userId} to Couple ID: ${coupleId}`)

  // 1. Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    console.error('User not found')
    return
  }

  console.log('User found:', {
    email: user.email,
    name: user.name,
    currentCoupleId: user.coupleId
  })

  // 2. Check if couple exists (optional but good practice)
  const couple = await prisma.couple.findUnique({
    where: { id: coupleId }
  })

  if (!couple) {
    console.error('Couple group not found')
    return
  }
  console.log('Couple found:', couple.id)

  // 3. Update the user
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { coupleId: coupleId }
  })

  console.log(`Successfully added user ${updatedUser.email} to couple ${coupleId}`)
  
  // Verify status
  const finalUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { couple: { include: { users: true } } }
  })
  
  if (finalUser?.couple) {
    console.log('--- Current Couple Members ---')
    finalUser.couple.users.forEach(u => console.log(`${u.name} (${u.email}) - ID: ${u.id}`))
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
