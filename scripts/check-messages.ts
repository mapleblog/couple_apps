
import prisma from '../lib/prisma'

async function main() {
  const coupleId = 'cml12pxwy0000yc1ytibui4ti' // Known from previous steps

  const messages = await prisma.message.findMany({
    where: { coupleId },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      sender: {
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true
        }
      }
    }
  })

  console.log(`Found ${messages.length} recent messages for couple ${coupleId}`)
  
  messages.forEach(m => {
    console.log(`[${m.createdAt.toISOString()}] ${m.sender.name} (${m.sender.email}): ${m.content}`)
    console.log(`   Sender ID: ${m.senderId}`)
    console.log(`   Avatar URL: ${m.sender.avatarUrl}`)
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
