# Supabase Storage Setup Instructions

The avatar upload feature requires a correctly configured Storage Bucket and RLS Policies in Supabase. Since the automated setup failed due to database connection issues, please follow these manual steps in your Supabase Dashboard.

## 1. Create the 'avatars' Bucket

1.  Log in to your **[Supabase Dashboard](https://supabase.com/dashboard)**.
2.  Go to the **Storage** section (folder icon in the left sidebar).
3.  Click **"New Bucket"**.
4.  Enter the name: `avatars`.
5.  **IMPORTANT**: Toggle **"Public bucket"** to **ON**.
6.  Click **"Save"**.

## 2. Add RLS Policies

For users to be able to upload images, you must allow access via Policies.

1.  In the **Storage** section, click on the **Policies** tab (or "Configuration" > "Policies").
2.  Find the `avatars` bucket in the list.
3.  Click **"New Policy"**.
4.  Choose **"Get started quickly"** or **"For full customization"**.
    *   *Simplest Option*: Choose **"Give users access to all files"** template if available, OR create from scratch.

### Recommended Policies (Create these 3 policies):

#### Policy 1: Allow Public Read Access
*   **Name**: `Public Access`
*   **Allowed operations**: `SELECT`
*   **Target roles**: `anon`, `authenticated` (or just leave default)
*   **USING expression**: `bucket_id = 'avatars'`

#### Policy 2: Allow Authenticated Uploads
*   **Name**: `Authenticated Upload`
*   **Allowed operations**: `INSERT`
*   **Target roles**: `authenticated`
*   **WITH CHECK expression**: `bucket_id = 'avatars'`

#### Policy 3: Allow Authenticated Updates (Optional but recommended)
*   **Name**: `Authenticated Update`
*   **Allowed operations**: `UPDATE`
*   **Target roles**: `authenticated`
*   **USING expression**: `bucket_id = 'avatars'`

## 3. Verify
Once these policies are saved, go back to your app and try clicking the avatar to upload an image again. It should work immediately.
