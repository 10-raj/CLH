import { useState, useEffect, useRef } from 'react';
import { BarChart3, MapPin, Mountain, Image, Video, Map, Upload, X, Play } from 'lucide-react';
import { getWebsiteSettings, updateWebsiteSettings } from '../../services/admin';
import { AdminLoading, AdminError, Field, inputClass, SaveBar } from './AdminUI';
import { ImageUpload } from './ImageUpload';
import { supabase } from '../../services/supabase';

interface SettingsRow {
  id: string;
  stat_donors: string;
  stat_raised: string;
  stat_projects: string;
  stat_regions: string;
  stat_completed_hikes: string;
  stat_volunteers: string;
  stat_waste_collected: string;
  stat_partners: string;
  org_address: string;
  org_email: string;
  org_phone: string;
  org_hours: string;
  next_hike_name: string;
  next_hike_location: string;
  next_hike_date: string;
  next_hike_description: string;
  next_hike_time: string;
  next_hike_meeting_point: string;
  next_hike_difficulty: string;
  next_hike_registration_link: string;
  next_hike_map_url: string;
  next_hike_image: string;
  featured_photo_image: string;
  featured_photo_title: string;
  featured_photo_description: string;
  featured_photo_link: string;
  featured_video_url: string;
  featured_video_title: string;
  featured_video_description: string;
}

const SUPPORTED_VIDEO_FORMATS = ['video/mp4', 'video/webm', 'video/quicktime'];

async function uploadVideoToStorage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4';
  const fileName = `video-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from('admin-images')
    .upload(fileName, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from('admin-images').getPublicUrl(fileName);
  return data.publicUrl;
}

function VideoUploadField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!SUPPORTED_VIDEO_FORMATS.includes(file.type)) {
      setError('Unsupported format. Use MP4, WebM, or MOV.');
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const url = await uploadVideoToStorage(file);
      onChange(url);
    } catch (err) {
      console.error(err);
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setUploadMode('url')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${uploadMode === 'url' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
          Paste URL
        </button>
        <button
          type="button"
          onClick={() => setUploadMode('file')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${uploadMode === 'file' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
          Upload File
        </button>
      </div>

      {uploadMode === 'url' ? (
        <input
          className={inputClass}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://...  (mp4, webm, mov)"
        />
      ) : (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
            onChange={handleFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-rose-400 dark:hover:border-rose-500 transition-colors bg-gray-50 dark:bg-gray-900/50 disabled:opacity-60"
          >
            {uploading ? (
              <>
                <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Uploading…</span>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Click to upload video</span>
                <span className="text-xs text-gray-400">MP4, WebM, MOV supported</span>
              </>
            )}
          </button>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="relative rounded-xl overflow-hidden bg-black border border-gray-200 dark:border-gray-700">
          <video
            src={value}
            controls
            className="w-full max-h-48 object-contain"
            key={value}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white transition-colors"
            title="Remove video"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/70 text-white text-xs">
            <Play className="w-3 h-3" />
            Preview
          </div>
        </div>
      )}
    </div>
  );
}

export function SettingsManager() {
  const [form, setForm] = useState<Partial<SettingsRow>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function load() {
    try {
      setError(null);
      setLoading(true);
      const data = await getWebsiteSettings();
      setForm(data);
    } catch (e) {
      console.error(e);
      setError('Failed to fetch settings.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const { id, ...payload } = form as SettingsRow;
      await updateWebsiteSettings(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminLoading />;
  if (error) return <AdminError message={error} onRetry={load} />;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Website Settings</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Edit homepage content, statistics, contact info, and next hike details</p>

      {saved && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-medium">
          Settings saved successfully!
        </div>
      )}

      <div className="space-y-6 max-w-2xl">
        {/* Featured Photo */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600">
              <Image className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Featured Photo (Homepage)</h2>
          </div>
          <div className="space-y-4">
            <ImageUpload
              label="Featured Image"
              folder="featured"
              value={form.featured_photo_image || ''}
              onChange={url => setForm({ ...form, featured_photo_image: url })}
            />
            <Field label="Title">
              <input className={inputClass} value={form.featured_photo_title || ''} onChange={e => setForm({ ...form, featured_photo_title: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea rows={2} className={inputClass} value={form.featured_photo_description || ''} onChange={e => setForm({ ...form, featured_photo_description: e.target.value })} />
            </Field>
            <Field label="Link (e.g. /hikes)">
              <input className={inputClass} value={form.featured_photo_link || ''} onChange={e => setForm({ ...form, featured_photo_link: e.target.value })} />
            </Field>
          </div>
        </div>

        {/* Featured Video */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500 to-red-600">
              <Video className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Featured Video (Homepage)</h2>
          </div>
          <div className="space-y-4">
            <Field label="Video — Upload from PC or paste a URL (MP4, WebM, MOV)">
              <VideoUploadField
                value={form.featured_video_url || ''}
                onChange={url => setForm({ ...form, featured_video_url: url })}
              />
            </Field>
            <Field label="Title">
              <input className={inputClass} value={form.featured_video_title || ''} onChange={e => setForm({ ...form, featured_video_title: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea rows={2} className={inputClass} value={form.featured_video_description || ''} onChange={e => setForm({ ...form, featured_video_description: e.target.value })} />
            </Field>
          </div>
        </div>

        {/* Homepage Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Homepage Statistics</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Completed Hikes">
              <input className={inputClass} value={form.stat_completed_hikes || ''} onChange={e => setForm({ ...form, stat_completed_hikes: e.target.value })} placeholder="5+" />
            </Field>
            <Field label="Volunteers">
              <input className={inputClass} value={form.stat_volunteers || ''} onChange={e => setForm({ ...form, stat_volunteers: e.target.value })} placeholder="50+" />
            </Field>
            <Field label="Waste Collected">
              <input className={inputClass} value={form.stat_waste_collected || ''} onChange={e => setForm({ ...form, stat_waste_collected: e.target.value })} placeholder="200kg" />
            </Field>
            <Field label="Partner Organizations">
              <input className={inputClass} value={form.stat_partners || ''} onChange={e => setForm({ ...form, stat_partners: e.target.value })} placeholder="10+" />
            </Field>
            <Field label="Total Donors">
              <input className={inputClass} value={form.stat_donors || ''} onChange={e => setForm({ ...form, stat_donors: e.target.value })} placeholder="500+" />
            </Field>
            <Field label="Total Raised">
              <input className={inputClass} value={form.stat_raised || ''} onChange={e => setForm({ ...form, stat_raised: e.target.value })} placeholder="Rs. 2,50,000+" />
            </Field>
          </div>
        </div>

        {/* Next Clean Hike */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Next Clean Hike (Contact Page)</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            This date and info is displayed on the contact page instead of a date picker.
          </p>
          <div className="space-y-4">
            <ImageUpload label="Hike Featured Image" folder="next-hike" value={form.next_hike_image || ''} onChange={url => setForm({ ...form, next_hike_image: url })} />
            <Field label="Hike Name">
              <input className={inputClass} value={form.next_hike_name || ''} onChange={e => setForm({ ...form, next_hike_name: e.target.value })} />
            </Field>
            <Field label="Hike Location">
              <input className={inputClass} value={form.next_hike_location || ''} onChange={e => setForm({ ...form, next_hike_location: e.target.value })} />
            </Field>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Date (displayed as-is, e.g. Saturday, 15 August 2026)">
                <input className={inputClass} value={form.next_hike_date || ''} onChange={e => setForm({ ...form, next_hike_date: e.target.value })} placeholder="Saturday, 15 August 2026" />
              </Field>
              <Field label="Time">
                <input className={inputClass} value={form.next_hike_time || ''} onChange={e => setForm({ ...form, next_hike_time: e.target.value })} placeholder="7:00 AM" />
              </Field>
            </div>
            <Field label="Meeting Point">
              <input className={inputClass} value={form.next_hike_meeting_point || ''} onChange={e => setForm({ ...form, next_hike_meeting_point: e.target.value })} />
            </Field>
            <Field label="Difficulty">
              <select className={inputClass} value={form.next_hike_difficulty || 'Easy'} onChange={e => setForm({ ...form, next_hike_difficulty: e.target.value })}>
                <option>Easy</option>
                <option>Moderate</option>
                <option>Challenging</option>
                <option>Hard</option>
              </select>
            </Field>
            <Field label="Description">
              <textarea rows={3} className={inputClass} value={form.next_hike_description || ''} onChange={e => setForm({ ...form, next_hike_description: e.target.value })} />
            </Field>
            <Field label="Registration Link (optional)">
              <input className={inputClass} value={form.next_hike_registration_link || ''} onChange={e => setForm({ ...form, next_hike_registration_link: e.target.value })} placeholder="https://..." />
            </Field>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                <Map className="w-4 h-4" /> Google Maps URL
              </label>
              <input className={inputClass} value={form.next_hike_map_url || ''} onChange={e => setForm({ ...form, next_hike_map_url: e.target.value })} placeholder="https://maps.google.com/maps?q=...&output=embed" />
              <p className="text-xs text-gray-400 mt-1">Paste a Google Maps share URL or embed URL.</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Organization Contact Info</h2>
          </div>
          <div className="space-y-4">
            <Field label="Address">
              <input className={inputClass} value={form.org_address || ''} onChange={e => setForm({ ...form, org_address: e.target.value })} />
            </Field>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Email">
                <input className={inputClass} value={form.org_email || ''} onChange={e => setForm({ ...form, org_email: e.target.value })} />
              </Field>
              <Field label="Phone">
                <input className={inputClass} value={form.org_phone || ''} onChange={e => setForm({ ...form, org_phone: e.target.value })} />
              </Field>
            </div>
            <Field label="Working Hours">
              <input className={inputClass} value={form.org_hours || ''} onChange={e => setForm({ ...form, org_hours: e.target.value })} />
            </Field>
          </div>
        </div>

        <SaveBar onSave={handleSave} onCancel={load} saving={saving} saveLabel="Save Settings" />
      </div>
    </div>
  );
}
