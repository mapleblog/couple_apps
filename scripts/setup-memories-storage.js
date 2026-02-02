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
    
    // 1. Create 'memories' bucket
    console.log('Creating "memories" bucket...');
    await prisma.$executeRawUnsafe(`
      INSERT INTO storage.buckets (id, name, public)
      VALUES ('memories', 'memories', true)
      ON CONFLICT (id) DO UPDATE SET public = true;
    `);
    console.log('Bucket "memories" ensured.');

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
                AND policyname = 'Public Access Memories'
            ) THEN
                CREATE POLICY "Public Access Memories"
                ON storage.objects FOR SELECT
                USING ( bucket_id = 'memories' );
            END IF;
        END
        $$;
      `);
      console.log('Policy "Public Access Memories" ensured.');
    } catch (e) {
      console.error('Error creating "Public Access Memories" policy:', e.message);
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
                AND policyname = 'Authenticated Upload Memories'
            ) THEN
                CREATE POLICY "Authenticated Upload Memories"
                ON storage.objects FOR INSERT
                WITH CHECK ( bucket_id = 'memories' AND auth.role() = 'authenticated' );
            END IF;
        END
        $$;
      `);
      console.log('Policy "Authenticated Upload Memories" ensured.');
    } catch (e) {
      console.error('Error creating "Authenticated Upload Memories" policy:', e.message);
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
                AND policyname = 'Authenticated Update Memories'
            ) THEN
                CREATE POLICY "Authenticated Update Memories"
                ON storage.objects FOR UPDATE
                USING ( bucket_id = 'memories' AND auth.role() = 'authenticated' );
            END IF;
        END
        $$;
      `);
      console.log('Policy "Authenticated Update Memories" ensured.');
    } catch (e) {
      console.error('Error creating "Authenticated Update Memories" policy:', e.message);
    }
    
    // Authenticated Delete (DELETE)
    try {
      await prisma.$executeRawUnsafe(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_policies 
                WHERE tablename = 'objects' 
                AND schemaname = 'storage' 
                AND policyname = 'Authenticated Delete Memories'
            ) THEN
                CREATE POLICY "Authenticated Delete Memories"
                ON storage.objects FOR DELETE
                USING ( bucket_id = 'memories' AND auth.role() = 'authenticated' );
            END IF;
        END
        $$;
      `);
      console.log('Policy "Authenticated Delete Memories" ensured.');
    } catch (e) {
      console.error('Error creating "Authenticated Delete Memories" policy:', e.message);
    }

  } catch (e) {
    console.error("Error executing SQL:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
