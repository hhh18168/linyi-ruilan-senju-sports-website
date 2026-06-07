import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { ImagePlus, LayoutDashboard, LogOut, PackagePlus, Save, Settings, Trash2 } from 'lucide-react';
import { defaultCmsProducts, defaultLayoutSettings, defaultSiteSettings } from './cms';
import type { CmsProduct, Inquiry, LayoutSettings, SiteSettings } from './cmsTypes';

type Session = {
  loggedIn: boolean;
  username: string | null;
  codeVerified: boolean;
};

type Tab = 'products' | 'inquiries' | 'content' | 'layout';

const emptyProduct: CmsProduct = {
  id: '',
  name: '',
  category: '',
  categorySlug: '',
  album: '',
  image: '',
  sourceUrl: '',
  visible: true,
  sortOrder: 1,
};

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data as T;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function AdminApp() {
  const [session, setSession] = useState<Session>({ loggedIn: false, username: null, codeVerified: false });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [tab, setTab] = useState<Tab>('products');
  const [login, setLogin] = useState({ username: '', password: '' });
  const [permissionCode, setPermissionCode] = useState('');
  const [products, setProducts] = useState<CmsProduct[]>(defaultCmsProducts);
  const [draft, setDraft] = useState<CmsProduct>(emptyProduct);
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [layout, setLayout] = useState<LayoutSettings>(defaultLayoutSettings);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const visibleProducts = useMemo(() => products.filter((product) => product.visible).length, [products]);

  useEffect(() => {
    refreshSession();
  }, []);

  useEffect(() => {
    if (session.loggedIn && session.codeVerified) loadAdminData();
  }, [session.loggedIn, session.codeVerified]);

  const refreshSession = async () => {
    try {
      const data = await api<Session>('/api/admin/me');
      setSession(data);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminData = async () => {
    setMessage('');
    try {
      const [nextProducts, nextSettings, nextLayout, inquiryData] = await Promise.all([
        api<CmsProduct[]>('/api/admin/products'),
        api<SiteSettings>('/api/admin/site-settings'),
        api<LayoutSettings>('/api/admin/layout-settings'),
        api<{ inquiries: Inquiry[] }>('/api/admin/inquiries').catch(() => ({ inquiries: [] })),
      ]);
      setProducts(nextProducts);
      setSettings(nextSettings);
      setLayout(nextLayout);
      setInquiries(inquiryData.inquiries);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to load admin data');
    }
  };

  const submitLogin = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    try {
      await api('/api/admin/login', { method: 'POST', body: JSON.stringify(login) });
      await refreshSession();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const submitCode = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    try {
      await api('/api/admin/verify-code', { method: 'POST', body: JSON.stringify({ code: permissionCode }) });
      await refreshSession();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Permission code failed');
    }
  };

  const logout = async () => {
    await api('/api/admin/logout', { method: 'POST' });
    setSession({ loggedIn: false, username: null, codeVerified: false });
  };

  const saveProducts = async () => {
    setMessage('Saving products...');
    try {
      await api('/api/admin/products', { method: 'PUT', body: JSON.stringify({ products }) });
      setMessage('Products saved. Vercel will redeploy the website automatically.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Save failed');
    }
  };

  const addOrUpdateProduct = () => {
    const id = draft.id || slugify(`${draft.category}-${draft.name}-${Date.now()}`);
    const nextProduct = {
      ...draft,
      id,
      categorySlug: draft.categorySlug || slugify(draft.category),
      sortOrder: Number(draft.sortOrder) || products.length + 1,
    };
    setProducts((current) => {
      const exists = current.some((product) => product.id === id);
      return exists ? current.map((product) => (product.id === id ? nextProduct : product)) : [...current, nextProduct];
    });
    setDraft(emptyProduct);
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setMessage('Uploading image...');
        const data = await api<{ url: string }>('/api/admin/upload-image', {
          method: 'POST',
          body: JSON.stringify({ filename: file.name, contentType: file.type, base64: reader.result }),
        });
        setDraft((current) => ({ ...current, image: data.url }));
        setMessage('Image uploaded. Add or update the product, then save products.');
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Upload failed');
      }
    };
    reader.readAsDataURL(file);
  };

  const saveSettings = async () => {
    setMessage('Saving site content...');
    try {
      await api('/api/admin/site-settings', { method: 'PUT', body: JSON.stringify({ settings }) });
      setMessage('Site content saved. Vercel will redeploy automatically.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Save failed');
    }
  };

  const saveLayout = async () => {
    setMessage('Saving layout...');
    try {
      await api('/api/admin/layout-settings', { method: 'PUT', body: JSON.stringify({ settings: layout }) });
      setMessage('Layout saved. Vercel will redeploy automatically.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Save failed');
    }
  };

  if (loading) return <AdminShell title="Loading admin..." />;

  if (!session.loggedIn) {
    return (
      <AdminShell title="Admin Login">
        <form className="admin-card mx-auto max-w-md" onSubmit={submitLogin}>
          <AdminField label="Username">
            <input className="input" value={login.username} onChange={(event) => setLogin({ ...login, username: event.target.value })} />
          </AdminField>
          <AdminField label="Password">
            <input className="input" type="password" value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} />
          </AdminField>
          <button className="admin-primary" type="submit">Login</button>
          {message && <p className="admin-message">{message}</p>}
        </form>
      </AdminShell>
    );
  }

  if (!session.codeVerified) {
    return (
      <AdminShell title="Permission Code">
        <form className="admin-card mx-auto max-w-md" onSubmit={submitCode}>
          <AdminField label="Permission code">
            <input className="input" type="password" value={permissionCode} onChange={(event) => setPermissionCode(event.target.value)} />
          </AdminField>
          <button className="admin-primary" type="submit">Enter Admin Panel</button>
          {message && <p className="admin-message">{message}</p>}
        </form>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Linyi Ruilan Senju Admin">
      <div className="mb-5 flex flex-col gap-3 rounded-md bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-slate-500">Signed in as {session.username}</p>
          <p className="mt-1 text-sm text-slate-500">{products.length} products, {visibleProducts} visible, {inquiries.length} inquiries loaded</p>
        </div>
        <button className="admin-secondary" type="button" onClick={logout}><LogOut size={16} /> Logout</button>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
        <TabButton tab={tab} value="products" onClick={setTab} icon={<PackagePlus size={17} />} label="Products" />
        <TabButton tab={tab} value="inquiries" onClick={setTab} icon={<LayoutDashboard size={17} />} label="Inquiries" />
        <TabButton tab={tab} value="content" onClick={setTab} icon={<Settings size={17} />} label="Content" />
        <TabButton tab={tab} value="layout" onClick={setTab} icon={<LayoutDashboard size={17} />} label="Layout" />
      </div>

      {message && <div className="mb-5 rounded-md bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800 ring-1 ring-amber-200">{message}</div>}

      {tab === 'products' && (
        <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
          <section className="admin-card">
            <h2 className="admin-title">Add / Edit Product</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Product name">
                <input className="input" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
              </AdminField>
              <AdminField label="Category">
                <input className="input" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value, categorySlug: slugify(event.target.value) })} />
              </AdminField>
              <AdminField label="Album / model group">
                <input className="input" value={draft.album} onChange={(event) => setDraft({ ...draft, album: event.target.value })} />
              </AdminField>
              <AdminField label="Sort order">
                <input className="input" type="number" value={draft.sortOrder} onChange={(event) => setDraft({ ...draft, sortOrder: Number(event.target.value) })} />
              </AdminField>
              <AdminField label="Image URL">
                <input className="input" value={draft.image} onChange={(event) => setDraft({ ...draft, image: event.target.value })} />
              </AdminField>
              <AdminField label="Upload image">
                <label className="admin-upload">
                  <ImagePlus size={18} /> Choose image
                  <input className="hidden" type="file" accept="image/*" onChange={uploadImage} />
                </label>
              </AdminField>
              <AdminField label="Source URL">
                <input className="input" value={draft.sourceUrl || ''} onChange={(event) => setDraft({ ...draft, sourceUrl: event.target.value })} />
              </AdminField>
              <label className="flex items-center gap-2 pt-7 text-sm font-black">
                <input type="checkbox" checked={draft.visible} onChange={(event) => setDraft({ ...draft, visible: event.target.checked })} />
                Visible on website
              </label>
            </div>
            <button className="admin-primary mt-5" type="button" onClick={addOrUpdateProduct}>Add / Update Product</button>
          </section>

          <section className="admin-card">
            <div className="flex items-center justify-between gap-3">
              <h2 className="admin-title">Product List</h2>
              <button className="admin-primary" type="button" onClick={saveProducts}><Save size={16} /> Save Products</button>
            </div>
            <div className="mt-4 grid max-h-[640px] gap-3 overflow-auto pr-1">
              {products
                .slice()
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((product) => (
                  <div key={product.id} className="grid gap-3 rounded-md border border-slate-200 p-3 sm:grid-cols-[80px_1fr_auto]">
                    <img className="h-20 w-20 rounded-md bg-slate-100 object-cover" src={product.image} alt={product.name} />
                    <div>
                      <p className="font-black">{product.name}</p>
                      <p className="text-sm text-slate-500">{product.category} / {product.album}</p>
                      <p className="mt-1 text-xs text-slate-400">{product.image}</p>
                    </div>
                    <div className="flex gap-2 sm:flex-col">
                      <button className="admin-secondary" type="button" onClick={() => setDraft(product)}>Edit</button>
                      <button className="admin-danger" type="button" onClick={() => setProducts((current) => current.filter((item) => item.id !== product.id))}>
                        <Trash2 size={15} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>
      )}

      {tab === 'inquiries' && (
        <section className="admin-card">
          <h2 className="admin-title">Customer Inquiries</h2>
          <div className="mt-4 grid gap-3">
            {inquiries.length === 0 && <p className="text-sm text-slate-500">No inquiries loaded yet.</p>}
            {inquiries.map((inquiry) => (
              <article key={inquiry.id} className="rounded-md border border-slate-200 p-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="font-black">{inquiry.name}</h3>
                  <span className="text-xs font-bold text-slate-500">{new Date(inquiry.createdAt).toLocaleString()}</span>
                </div>
                <p className="mt-2 text-sm"><b>Contact:</b> {inquiry.contact}</p>
                <p className="text-sm"><b>Product:</b> {inquiry.product}</p>
                <p className="text-sm"><b>Quantity:</b> {inquiry.quantity}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{inquiry.message}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === 'content' && (
        <section className="admin-card">
          <div className="flex items-center justify-between gap-3">
            <h2 className="admin-title">Website Content</h2>
            <button className="admin-primary" type="button" onClick={saveSettings}><Save size={16} /> Save Content</button>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {Object.entries(settings).map(([key, value]) => (
              <AdminField key={key} label={key}>
                {Array.isArray(value) ? (
                  <textarea
                    className="input min-h-24"
                    value={value.join('\n')}
                    onChange={(event) => setSettings({ ...settings, [key]: event.target.value.split('\n').map((item) => item.trim()).filter(Boolean) })}
                  />
                ) : key.toLowerCase().includes('text') || key.toLowerCase().includes('intro') || key.toLowerCase().includes('subtitle') ? (
                  <textarea className="input min-h-24" value={String(value)} onChange={(event) => setSettings({ ...settings, [key]: event.target.value })} />
                ) : (
                  <input className="input" value={String(value)} onChange={(event) => setSettings({ ...settings, [key]: event.target.value })} />
                )}
              </AdminField>
            ))}
          </div>
        </section>
      )}

      {tab === 'layout' && (
        <section className="admin-card">
          <div className="flex items-center justify-between gap-3">
            <h2 className="admin-title">Layout Settings</h2>
            <button className="admin-primary" type="button" onClick={saveLayout}><Save size={16} /> Save Layout</button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <AdminField label="Primary color">
              <input className="input" value={layout.primaryColor} onChange={(event) => setLayout({ ...layout, primaryColor: event.target.value })} />
            </AdminField>
            <AdminField label="Accent color">
              <input className="input" value={layout.accentColor} onChange={(event) => setLayout({ ...layout, accentColor: event.target.value })} />
            </AdminField>
            <AdminField label="Catalog columns">
              <input className="input" type="number" min={2} max={4} value={layout.catalogColumns} onChange={(event) => setLayout({ ...layout, catalogColumns: Number(event.target.value) })} />
            </AdminField>
          </div>
          <div className="mt-5 grid gap-3">
            {layout.sections
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <div key={section.id} className="grid gap-3 rounded-md border border-slate-200 p-3 sm:grid-cols-[1fr_140px_140px]">
                  <div>
                    <p className="font-black">{section.label}</p>
                    <p className="text-xs text-slate-500">{section.id}</p>
                  </div>
                  <input
                    className="input"
                    type="number"
                    value={section.order}
                    onChange={(event) =>
                      setLayout({
                        ...layout,
                        sections: layout.sections.map((item) => (item.id === section.id ? { ...item, order: Number(event.target.value) } : item)),
                      })
                    }
                  />
                  <label className="flex items-center gap-2 text-sm font-black">
                    <input
                      type="checkbox"
                      checked={section.visible}
                      onChange={(event) =>
                        setLayout({
                          ...layout,
                          sections: layout.sections.map((item) => (item.id === section.id ? { ...item, visible: event.target.checked } : item)),
                        })
                      }
                    />
                    Show section
                  </label>
                </div>
              ))}
          </div>
        </section>
      )}
    </AdminShell>
  );
}

function AdminShell({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-field text-ink">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a className="text-sm font-black text-court" href="/">View Website</a>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Admin</span>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-black tracking-normal">{title}</h1>
        {children}
      </main>
    </div>
  );
}

function AdminField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function TabButton({
  tab,
  value,
  onClick,
  icon,
  label,
}: {
  tab: Tab;
  value: Tab;
  onClick: (tab: Tab) => void;
  icon: React.ReactNode;
  label: string;
}) {
  const active = tab === value;
  return (
    <button className={active ? 'admin-primary' : 'admin-secondary'} type="button" onClick={() => onClick(value)}>
      {icon} {label}
    </button>
  );
}

export default AdminApp;
