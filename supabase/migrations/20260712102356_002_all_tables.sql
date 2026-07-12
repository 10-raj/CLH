
-- ============================================================
-- HIKES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS hikes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  location VARCHAR(255) NOT NULL,
  region VARCHAR(255) NOT NULL,
  difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('Easy', 'Moderate', 'Challenging', 'Hard')),
  duration VARCHAR(100) NOT NULL,
  distance VARCHAR(100) NOT NULL,
  max_elevation INTEGER NOT NULL,
  best_season TEXT[] NOT NULL,
  description TEXT NOT NULL,
  highlights TEXT[] NOT NULL,
  image VARCHAR(500) NOT NULL,
  gallery TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  price DECIMAL(10,2) NOT NULL,
  group_size VARCHAR(50) NOT NULL,
  rating DECIMAL(3,2) DEFAULT 4.5,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hikes_difficulty ON hikes(difficulty);
CREATE INDEX IF NOT EXISTS idx_hikes_featured ON hikes(featured);
CREATE INDEX IF NOT EXISTS idx_hikes_region ON hikes(region);
CREATE INDEX IF NOT EXISTS idx_hikes_slug ON hikes(slug);

ALTER TABLE hikes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hikes_select_policy" ON hikes FOR SELECT TO public USING (true);
CREATE POLICY "hikes_insert_policy" ON hikes FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "hikes_update_policy" ON hikes FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "hikes_delete_policy" ON hikes FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE TRIGGER update_hikes_updated_at
  BEFORE UPDATE ON hikes FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- DONATION CAMPAIGNS
-- ============================================================
CREATE TABLE IF NOT EXISTS donation_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  goal_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) DEFAULT 0,
  category VARCHAR(50) NOT NULL CHECK (category IN ('environmental', 'community', 'infrastructure', 'education')),
  image VARCHAR(500) NOT NULL,
  donors_count INTEGER DEFAULT 0,
  campaign_date DATE,
  location VARCHAR(255),
  featured_image VARCHAR(500),
  is_published BOOLEAN DEFAULT false,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_category ON donation_campaigns(category);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON donation_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_published ON donation_campaigns(is_published);

ALTER TABLE donation_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaigns_select_policy" ON donation_campaigns FOR SELECT TO public USING (true);
CREATE POLICY "campaigns_insert_policy" ON donation_campaigns FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "campaigns_update_policy" ON donation_campaigns FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "campaigns_delete_policy" ON donation_campaigns FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON donation_campaigns FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- DONATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES donation_campaigns(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id VARCHAR(255),
  donor_name VARCHAR(255),
  donor_email VARCHAR(255),
  donor_phone VARCHAR(50),
  is_anonymous BOOLEAN DEFAULT false,
  message TEXT,
  remarks TEXT,
  screenshot_url VARCHAR(500),
  verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_donations_campaign ON donations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_donations_user ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(payment_status);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "donations_insert_anon" ON donations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "donations_select_anon" ON donations FOR SELECT TO anon USING (true);
CREATE POLICY "donations_select_auth" ON donations FOR SELECT TO authenticated USING (true);
CREATE POLICY "donations_update_admin" ON donations FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "donations_delete_admin" ON donations FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- SPONSORS
-- ============================================================
CREATE TABLE IF NOT EXISTS sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  logo VARCHAR(500) NOT NULL,
  website VARCHAR(500),
  tier VARCHAR(50) NOT NULL CHECK (tier IN ('platinum', 'gold', 'silver', 'bronze')),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sponsors_tier ON sponsors(tier);
CREATE INDEX IF NOT EXISTS idx_sponsors_active ON sponsors(is_active);

ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sponsors_select_policy" ON sponsors FOR SELECT TO public USING (true);
CREATE POLICY "sponsors_insert_policy" ON sponsors FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "sponsors_update_policy" ON sponsors FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "sponsors_delete_policy" ON sponsors FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE TRIGGER update_sponsors_updated_at
  BEFORE UPDATE ON sponsors FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  phone VARCHAR(50),
  purpose VARCHAR(50) DEFAULT 'general' CHECK (purpose IN ('general', 'volunteer', 'partner', 'donation', 'booking', 'join_hike')),
  interest VARCHAR(100),
  partner_type VARCHAR(100),
  next_hike_location VARCHAR(255),
  number_of_members INTEGER,
  how_heard VARCHAR(100),
  hike_join_date DATE,
  status VARCHAR(50) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  replied_at TIMESTAMPTZ,
  reply_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_purpose ON contact_messages(purpose);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contact_select_admin" ON contact_messages FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "contact_insert_anonymous" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "contact_update_admin" ON contact_messages FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- GALLERY
-- ============================================================
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  src VARCHAR(500) NOT NULL,
  alt VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('hikes', 'nature', 'community', 'events')),
  location VARCHAR(255),
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_gallery_featured ON gallery(featured);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gallery_select_policy" ON gallery FOR SELECT TO public USING (true);
CREATE POLICY "gallery_insert_policy" ON gallery FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "gallery_update_policy" ON gallery FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "gallery_delete_policy" ON gallery FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TREK BOOKINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS trek_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hike_id UUID REFERENCES hikes(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  number_of_participants INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  special_requests TEXT,
  contact_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_hike ON trek_bookings(hike_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON trek_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON trek_bookings(status);

ALTER TABLE trek_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookings_select_admin" ON trek_bookings FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "bookings_insert_anon" ON trek_bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "bookings_update_admin" ON trek_bookings FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON trek_bookings FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TEAM MEMBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  bio TEXT,
  image VARCHAR(500),
  email VARCHAR(255),
  instagram VARCHAR(255),
  linkedin VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "team_select_policy" ON team_members FOR SELECT TO public USING (true);
CREATE POLICY "team_insert_policy" ON team_members FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "team_update_policy" ON team_members FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "team_delete_policy" ON team_members FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE TRIGGER update_team_updated_at
  BEFORE UPDATE ON team_members FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- WEBSITE SETTINGS (single-row CMS)
-- ============================================================
CREATE TABLE IF NOT EXISTS website_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_donors VARCHAR(50) DEFAULT '500+',
  stat_raised VARCHAR(50) DEFAULT 'Rs. 2,50,000+',
  stat_projects VARCHAR(50) DEFAULT '15+',
  stat_regions VARCHAR(50) DEFAULT '8+',
  stat_completed_hikes VARCHAR(50) DEFAULT '12+',
  stat_volunteers VARCHAR(50) DEFAULT '200+',
  stat_waste_collected VARCHAR(50) DEFAULT '500+ kg',
  stat_partners VARCHAR(50) DEFAULT '10+',
  org_address VARCHAR(500) DEFAULT 'Dakshinkali, Kathmandu, Nepal',
  org_email VARCHAR(255) DEFAULT 'acharyaraj2005@gmail.com',
  org_phone VARCHAR(50) DEFAULT '+977 98767262762',
  org_hours VARCHAR(255) DEFAULT 'Mon-Sat: 9:00 AM - 6:00 PM',
  next_hike_name VARCHAR(255) DEFAULT 'Community Clean Hike',
  next_hike_location VARCHAR(255) DEFAULT 'Champadevi Trail, Dakshinkali',
  next_hike_date VARCHAR(100) DEFAULT 'Saturday, 15 August 2026',
  next_hike_description TEXT DEFAULT 'Join us for our community clean hike. All are welcome!',
  next_hike_time VARCHAR(100) DEFAULT '7:00 AM',
  next_hike_meeting_point VARCHAR(255) DEFAULT 'Champadevi Trailhead',
  next_hike_difficulty VARCHAR(50) DEFAULT 'Easy',
  next_hike_registration_link VARCHAR(500) DEFAULT '',
  next_hike_map_url VARCHAR(500) DEFAULT '',
  next_hike_image VARCHAR(500) DEFAULT '',
  featured_photo_image VARCHAR(500) DEFAULT '',
  featured_photo_title VARCHAR(255) DEFAULT 'Trails of Nepal',
  featured_photo_description TEXT DEFAULT 'Explore the beautiful mountain trails of Nepal.',
  featured_photo_link VARCHAR(500) DEFAULT '/hikes',
  featured_video_url VARCHAR(500) DEFAULT 'https://cdn.pixabay.com/video/2024/01/15/197834-907453376_large.mp4',
  featured_video_title VARCHAR(255) DEFAULT 'Experience the Journey',
  featured_video_description TEXT DEFAULT 'Watch our latest adventure on the trails of Nepal.',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_select_public" ON website_settings FOR SELECT TO public USING (true);
CREATE POLICY "settings_insert_admin" ON website_settings FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "settings_update_admin" ON website_settings FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

INSERT INTO website_settings (id) VALUES (gen_random_uuid()) ON CONFLICT DO NOTHING;

-- ============================================================
-- Storage buckets
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('admin-images', 'admin-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('donation-screenshots', 'donation-screenshots', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "admin_images_public_read" ON storage.objects;
CREATE POLICY "admin_images_public_read" ON storage.objects FOR SELECT TO public
  USING (bucket_id IN ('admin-images', 'donation-screenshots'));

DROP POLICY IF EXISTS "admin_images_insert_admin" ON storage.objects;
CREATE POLICY "admin_images_insert_admin" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id IN ('admin-images', 'donation-screenshots')
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "admin_images_update_admin" ON storage.objects;
CREATE POLICY "admin_images_update_admin" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('admin-images', 'donation-screenshots')
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (bucket_id IN ('admin-images', 'donation-screenshots')
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "admin_images_delete_admin" ON storage.objects;
CREATE POLICY "admin_images_delete_admin" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('admin-images', 'donation-screenshots')
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
