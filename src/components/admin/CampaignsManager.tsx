import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Plus, Pencil, Trash2, Search, Eye, EyeOff, Calendar, MapPin } from 'lucide-react';
import { getAllCampaignsAdmin, createCampaign, updateCampaign, deleteCampaign } from '../../services/admin';
import { AdminLoading, AdminEmpty, AdminError, ConfirmDialog, AdminModal, Field, inputClass, SaveBar } from './AdminUI';
import { ImageUpload } from './ImageUpload';

interface CampaignRow {
  id: string;
  title: string;
  slug: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  category: string;
  image: string;
  featured_image: string;
  donors_count: number;
  campaign_date: string | null;
  location: string;
  end_date: string | null;
  status: string;
  is_published: boolean;
}

const emptyForm: Partial<CampaignRow> = {
  title: '',
  slug: '',
  description: '',
  goal_amount: 1000,
  current_amount: 0,
  category: 'environmental',
  image: '',
  featured_image: '',
  donors_count: 0,
  campaign_date: '',
  location: '',
  end_date: '',
  status: 'active',
  is_published: false,
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

export function CampaignsManager() {
  const [items, setItems] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CampaignRow | null>(null);
  const [form, setForm] = useState<Partial<CampaignRow>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CampaignRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    try {
      setError(null);
      setLoading(true);
      const data = await getAllCampaignsAdmin();
      setItems(data || []);
    } catch (e) {
      console.error(e);
      setError('Failed to fetch campaigns.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(c: CampaignRow) {
    setEditing(c);
    setForm({ ...c });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
    setForm(emptyForm);
  }

  function field(key: keyof CampaignRow) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }));
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setForm(f => ({ ...f, title, slug: editing ? f.slug : slugify(title) }));
  }

  async function handleSave() {
    if (!form.title || !form.description) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        goal_amount: Number(form.goal_amount) || 1000,
        current_amount: Number(form.current_amount) || 0,
        donors_count: Number(form.donors_count) || 0,
        campaign_date: form.campaign_date || null,
        end_date: form.end_date || null,
        slug: form.slug || slugify(form.title || ''),
        image: form.image || form.featured_image || '',
      };
      if (editing) {
        const { id, created_at, ...rest } = payload as any;
        await updateCampaign(editing.id, rest);
      } else {
        await createCampaign(payload);
      }
      closeModal();
      await load();
    } catch (e) {
      console.error(e);
      alert('Failed to save campaign.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCampaign(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (e) {
      console.error(e);
      alert('Failed to delete campaign.');
    } finally {
      setDeleting(false);
    }
  }

  async function togglePublish(c: CampaignRow) {
    try {
      await updateCampaign(c.id, { is_published: !c.is_published });
      setItems(prev => prev.map(i => i.id === c.id ? { ...i, is_published: !i.is_published } : i));
    } catch (e) {
      console.error(e);
      alert('Failed to update publish status.');
    }
  }

  const filtered = items.filter(c =>
    !search ||
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.location?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <AdminLoading />;
  if (error) return <AdminError message={error} onRetry={load} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Campaigns</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {items.filter(c => c.is_published).length} published · {items.length} total
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold shadow-lg hover:shadow-emerald-500/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by title or location..."
          className={`${inputClass} pl-10`}
        />
      </div>

      {filtered.length === 0 ? (
        <AdminEmpty icon={Megaphone} message="No campaigns yet. Create your first campaign." />
      ) : (
        <div className="space-y-4">
          {filtered.map(c => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
            >
              <div className="flex gap-4">
                {(c.featured_image || c.image) && (
                  <img
                    src={c.featured_image || c.image}
                    alt={c.title}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-gray-900 dark:text-white truncate">{c.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status] || ''}`}>
                          {c.status}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.is_published ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                          {c.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{c.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                        {c.campaign_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(c.campaign_date).toLocaleDateString()}
                          </span>
                        )}
                        {c.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {c.location}
                          </span>
                        )}
                        <span>Goal: Rs. {Number(c.goal_amount).toLocaleString()}</span>
                        <span>Raised: Rs. {Number(c.current_amount).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => togglePublish(c)}
                        title={c.is_published ? 'Unpublish' : 'Publish'}
                        className={`p-2 rounded-lg transition-colors ${c.is_published ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                      >
                        {c.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => openEdit(c)}
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(c)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>{c.donors_count} donors</span>
                      <span>{Math.min(100, Math.round((Number(c.current_amount) / Number(c.goal_amount)) * 100))}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                        style={{ width: `${Math.min(100, (Number(c.current_amount) / Number(c.goal_amount)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? 'Edit Campaign' : 'New Campaign'}
      >
        <div className="space-y-4">
          <Field label="Title *">
            <input className={inputClass} value={form.title || ''} onChange={handleTitleChange} placeholder="Campaign title" />
          </Field>
          <Field label="Slug">
            <input className={inputClass} value={form.slug || ''} onChange={field('slug')} placeholder="url-slug" />
          </Field>
          <Field label="Description *">
            <textarea className={`${inputClass} h-24 resize-none`} value={form.description || ''} onChange={field('description')} placeholder="Describe this campaign..." />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Campaign Date">
              <input type="date" className={inputClass} value={form.campaign_date || ''} onChange={field('campaign_date')} />
            </Field>
            <Field label="End Date">
              <input type="date" className={inputClass} value={form.end_date || ''} onChange={field('end_date')} />
            </Field>
          </div>

          <Field label="Location">
            <input className={inputClass} value={form.location || ''} onChange={field('location')} placeholder="Where is this campaign?" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Goal Amount (Rs.)">
              <input type="number" min={0} className={inputClass} value={form.goal_amount || ''} onChange={field('goal_amount')} />
            </Field>
            <Field label="Current Amount (Rs.)">
              <input type="number" min={0} className={inputClass} value={form.current_amount || ''} onChange={field('current_amount')} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <select className={inputClass} value={form.category || 'environmental'} onChange={field('category')}>
                <option value="environmental">Environmental</option>
                <option value="community">Community</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="education">Education</option>
              </select>
            </Field>
            <Field label="Status">
              <select className={inputClass} value={form.status || 'active'} onChange={field('status')}>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </Field>
          </div>

          <Field label="Featured Image">
            <ImageUpload
              value={form.featured_image || form.image || ''}
              onChange={url => setForm(f => ({ ...f, featured_image: url, image: url }))}
            />
          </Field>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
            <input
              type="checkbox"
              id="is_published"
              checked={!!form.is_published}
              onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
              className="w-4 h-4 accent-emerald-500"
            />
            <label htmlFor="is_published" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
              Publish this campaign (visible on website)
            </label>
          </div>
        </div>
        <SaveBar saving={saving} onSave={handleSave} onCancel={closeModal} />
      </AdminModal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Campaign"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
