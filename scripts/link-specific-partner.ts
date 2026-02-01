
import prisma from '../lib/prisma'

async function main() {
  const primaryEmail = 'tkgoh228@gmail.com'
  const partnerEmail = 'christon9128@hotmail.com'
  const partnerName = 'Thùy Trang'

  console.log(`Linking ${partnerEmail} to ${primaryEmail}...`)

  // 1. Get the primary user (tkgoh228@gmail.com)
  const primaryUser = await prisma.user.findUnique({
    where: { email: primaryEmail }
  })

  if (!primaryUser || !primaryUser.coupleId) {
    console.error(`Primary user ${primaryEmail} not found or has no couple ID.`)
    return
  }
  console.log(`Primary user found. Couple ID: ${primaryUser.coupleId}`)

  // 2. Remove the fake partner created previously (partner_for_tkgoh@example.com)
  try {
    const deletedFake = await prisma.user.delete({
      where: { email: 'partner_for_tkgoh@example.com' }
    })
    console.log('Removed temporary test partner:', deletedFake.email)
  } catch (e) {
    console.log('No temporary test partner found or already deleted.')
  }

  // 3. Find the real partner user (christon9128@hotmail.com)
  const partnerUser = await prisma.user.findUnique({
    where: { email: partnerEmail }
  })

  if (!partnerUser) {
    console.error(`Partner user ${partnerEmail} not found in database.`)
    // Optionally create them if they don't exist? 
    // The prompt implies they exist or should be treated as the specific account.
    // Let's assume they exist based on previous logs.
    return
  }

  // 4. Update the partner user
  const updatedPartner = await prisma.user.update({
    where: { email: partnerEmail },
    data: {
      coupleId: primaryUser.coupleId,
      name: partnerName
    }
  })

  console.log('Successfully updated partner:')
  console.log(`- Email: ${updatedPartner.email}`)
  console.log(`- Name: ${updatedPartner.name}`)
  console.log(`- New Couple ID: ${updatedPartner.coupleId}`)
  
  // Verify the couple
  const coupleUsers = await prisma.user.findMany({
    where: { coupleId: primaryUser.coupleId }
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
