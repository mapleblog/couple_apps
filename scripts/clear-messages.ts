import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const { count } = await prisma.message.deleteMany()
    console.log(`Successfully deleted ${count} messages.`)
  } catch (error) {
    console.error('Error deleting messages:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
