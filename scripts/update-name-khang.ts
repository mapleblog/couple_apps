import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const targetId = 'a5ff397a-d8b0-4b30-bac9-4b78315ffe8c'
  const newName = 'Đình Khang'

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
