const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    // 1. Create the 'avatars' bucket
    console.log("Creating 'avatars' bucket...")
    await prisma.$executeRaw`
      INSERT INTO storage.buckets (id, name, public)
      VALUES ('avatars', 'avatars', true)
      ON CONFLICT (id) DO NOTHING;
    `
    console.log("'avatars' bucket created or already exists.")

    // 2. Create a policy to allow public read access
    console.log("Creating public read policy...")
    await prisma.$executeRaw`
      CREATE POLICY "Public Access"
      ON storage.objects FOR SELECT
      USING ( bucket_id = 'avatars' );
    `
    console.log("Public read policy created.")

    // 3. Create a policy to allow authenticated uploads
    console.log("Creating authenticated upload policy...")
    await prisma.$executeRaw`
      CREATE POLICY "Authenticated Upload"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK ( bucket_id = 'avatars' );
    `
    console.log("Authenticated upload policy created.")

    // 4. Create a policy to allow users to update their own avatars (optional but good)
    console.log("Creating authenticated update policy...")
    await prisma.$executeRaw`
      CREATE POLICY "Authenticated Update"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING ( bucket_id = 'avatars' );
    `
    console.log("Authenticated update policy created.")

  } catch (e) {
    console.error("Error executing SQL:", e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
