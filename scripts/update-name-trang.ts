import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const targetId = 'eb194461-fc4d-41be-833f-9223de33cbec'
  const newName = 'Thuỳ Trang'

  console.log(`Updating user ${targetId} name to '${newName}'...`)

  try {
    const user = await prisma.user.update({
      where: { id: targetId },
      data: { name: newName },
    })
    console.log('Update successful:', user)
  } catch (error) {
    console.error('Error updating user:', error)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
