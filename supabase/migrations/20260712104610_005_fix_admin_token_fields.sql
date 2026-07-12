
-- Fix admin user: set empty string token fields to NULL (required by GoTrue)
UPDATE auth.users
SET
  confirmation_token = NULL,
  email_change       = NULL,
  email_change_token_new = NULL,
  recovery_token     = NULL,
  phone              = NULL,
  phone_confirmed_at = NULL,
  email_change_token_current = NULL,
  reauthentication_token = NULL
WHERE email = 'admin@cleanhike.com';
