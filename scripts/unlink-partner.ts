
import prisma from '../lib/prisma'

async function main() {
  const userId = 'eb194461-fc4d-41be-833f-9223de33cbec'
  console.log(`Unlinking partner for User ID: ${userId}`)

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

  if (!user.coupleId) {
    console.log('User is not linked to any couple.')
    return
  }

  // 2. Unlink the user
  await prisma.user.update({
    where: { id: userId },
    data: { coupleId: null }
  })

  console.log(`Successfully removed coupleId from user ${user.email}`)

  // Optional: Check if the couple is now empty or has only one user?
  // If we want to clean up empty couples, we could do that, but the request was just to unlink this user.
  
  // Verify status
  const updatedUser = await prisma.user.findUnique({
    where: { id: userId }
  })
  console.log('Updated status:', updatedUser)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
