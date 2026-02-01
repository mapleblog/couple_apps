
import prisma from '../lib/prisma'

async function main() {
  const targetEmail = 'tkgoh228@gmail.com'
  console.log(`Checking partner status for: ${targetEmail}`)

  const user = await prisma.user.findUnique({
    where: { email: targetEmail },
    include: {
      couple: {
        include: {
          users: true
        }
      }
    }
  })

  if (!user) {
    console.error('Target user not found')
    process.exit(1)
  }

  if (!user.coupleId) {
    console.error('Target user has no couple ID. Please create a couple first.')
    process.exit(1)
  }

  const existingPartners = user.couple?.users.filter(u => u.id !== user.id) || []

  if (existingPartners.length > 0) {
    console.log('User already has a partner:', existingPartners.map(u => u.email))
    return
  }

  console.log('No partner found. Creating a test partner...')

  const partnerEmail = 'partner_for_tkgoh@example.com'
  
  const partner = await prisma.user.upsert({
    where: { email: partnerEmail },
    update: {
      coupleId: user.coupleId,
      name: 'Test Partner'
    },
    create: {
      id: crypto.randomUUID(), // Generate a UUID for the fake user
      email: partnerEmail,
      name: 'Test Partner',
      coupleId: user.coupleId,
    }
  })

  console.log(`Partner created/linked: ${partner.email} (ID: ${partner.id})`)
  console.log(`Linked to Couple ID: ${user.coupleId}`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
