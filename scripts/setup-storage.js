const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Load .env
const envPath = path.join(__dirname, '..', '.env');
console.log('Loading .env from:', envPath);
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
});

async function main() {
  try {
    console.log('Connecting to database...');
    
    // 1. Create 'avatars' bucket
    console.log('Creating "avatars" bucket...');
    await prisma.$executeRawUnsafe(`
      INSERT INTO storage.buckets (id, name, public)
      VALUES ('avatars', 'avatars', true)
      ON CONFLICT (id) DO UPDATE SET public = true;
    `);
    console.log('Bucket "avatars" ensured.');

    // 2. Create Policies
    console.log('Setting up policies...');

    // Public Access (SELECT)
    try {
      await prisma.$executeRawUnsafe(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_policies 
                WHERE tablename = 'objects' 
                AND schemaname = 'storage' 
                AND policyname = 'Public Access'
            ) THEN
                CREATE POLICY "Public Access"
                ON storage.objects FOR SELECT
                USING ( bucket_id = 'avatars' );
            END IF;
        END
        $$;
      `);
      console.log('Policy "Public Access" ensured.');
    } catch (e) {
      console.error('Error creating "Public Access" policy:', e.message);
    }

    // Authenticated Upload (INSERT)
    try {
      await prisma.$executeRawUnsafe(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_policies 
                WHERE tablename = 'objects' 
                AND schemaname = 'storage' 
                AND policyname = 'Authenticated Upload'
            ) THEN
                CREATE POLICY "Authenticated Upload"
                ON storage.objects FOR INSERT
                WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );
            END IF;
        END
        $$;
      `);
      console.log('Policy "Authenticated Upload" ensured.');
    } catch (e) {
      console.error('Error creating "Authenticated Upload" policy:', e.message);
    }

    // Authenticated Update (UPDATE)
    try {
      await prisma.$executeRawUnsafe(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_policies 
                WHERE tablename = 'objects' 
                AND schemaname = 'storage' 
                AND policyname = 'Authenticated Update'
            ) THEN
                CREATE POLICY "Authenticated Update"
                ON storage.objects FOR UPDATE
                USING ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );
            END IF;
        END
        $$;
      `);
      console.log('Policy "Authenticated Update" ensured.');
    } catch (e) {
      console.error('Error creating "Authenticated Update" policy:', e.message);
    }

    console.log('Storage setup completed successfully!');

  } catch (error) {
    console.error('Setup failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
