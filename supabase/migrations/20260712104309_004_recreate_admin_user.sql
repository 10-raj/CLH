
-- Delete existing admin user completely and recreate with a fresh password hash
DO $$
DECLARE
  admin_email TEXT := 'admin@cleanhike.com';
  admin_uuid UUID := 'fb14491b-003d-45b1-8ea9-dbad5bb81df9';
BEGIN
  -- Remove identity first (FK constraint)
  DELETE FROM auth.identities WHERE user_id = admin_uuid;
  -- Remove user_profile
  DELETE FROM user_profiles WHERE id = admin_uuid;
  -- Remove auth user
  DELETE FROM auth.users WHERE id = admin_uuid;

  -- Recreate with a fresh bcrypt hash
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    admin_uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    admin_email,
    crypt('CleanHike@2026', gen_salt('bf', 10)),
    NOW(),
    NULL,
    NULL,
    '{"provider":"email","providers":["email"]}',
    '{"name":"Admin"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );

  INSERT INTO auth.identities (
    provider_id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    admin_uuid::text,
    admin_uuid,
    jsonb_build_object('sub', admin_uuid::text, 'email', admin_email, 'email_verified', true),
    'email',
    NOW(),
    NOW(),
    NOW()
  );

  INSERT INTO user_profiles (id, name, email, role)
  VALUES (admin_uuid, 'Admin', admin_email, 'admin')
  ON CONFLICT (id) DO UPDATE SET role = 'admin', email = EXCLUDED.email, name = EXCLUDED.name;
END $$;
