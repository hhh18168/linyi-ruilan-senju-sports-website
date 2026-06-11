import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { BarChart3, ImagePlus, LayoutDashboard, LogOut, PackagePlus, Save, Settings, Trash2 } from 'lucide-react';
import { defaultCmsProducts, defaultExchangeRates, defaultLayoutSettings, defaultSiteSettings, normalizeProduct } from './cms';
import type { CmsProduct, ExchangeRates, Inquiry, LayoutSettings, LayoutSection, SiteSettings } from './cmsTypes';

type Session = { loggedIn: boolean; username: string | null; codeVerified: boolean };
type Tab = 'products' | 'inquiries' | 'content' | 'layout' | 'rates' | 'analytics';

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
  prices: { baseCurrency: 'USD', basePrice: 0, priceUnit: 'piece' },
  galleryImages: [],
  galleryLabels: [],
  translations: {
    en: { name: '', category: '', album: '', description: '', scenario: '', highlights: [] },
    zh: { name: '', category: '', album: '', description: '', scenario: '', highlights: [] },
  },
  specs: [],
  detailSections: [],
};

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || '请求失败，请稍后重试。');
  return data as T;
}
function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

const linesToList = (value: string) => value.split('\n').map((item) => item.trim()).filter(Boolean);
const listToLines = (value?: string[]) => (value || []).join('\n');
const cloneEmpty = (): CmsProduct => JSON.parse(JSON.stringify(emptyProduct));

function normalizeForSave(products: CmsProduct[]) {
  return products
    .map((product, index) => ({
      ...normalizeProduct(product, index),
      categorySlug: product.categorySlug || slugify(product.category),
      sortOrder: index + 1,
      galleryImages: product.galleryImages?.length ? product.galleryImages : [product.image].filter(Boolean),
    }))
    .filter((product) => !/cricket|板球/i.test(`${product.name} ${product.category} ${product.categorySlug}`));
}

function AdminApp() {
  const [session, setSession] = useState<Session>({ loggedIn: false, username: null, codeVerified: false });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [tab, setTab] = useState<Tab>('products');
  const [login, setLogin] = useState({ username: '', password: '' });
  const [permissionCode, setPermissionCode] = useState('');
  const [products, setProducts] = useState<CmsProduct[]>(defaultCmsProducts);
  const [draft, setDraft] = useState<CmsProduct>(cloneEmpty());
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [layout, setLayout] = useState<LayoutSettings>(defaultLayoutSettings);
  const [rates, setRates] = useState<ExchangeRates>(defaultExchangeRates);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [mergeIds, setMergeIds] = useState<string[]>([]);
  const [draggingId, setDraggingId] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [codeSubmitting, setCodeSubmitting] = useState(false);

  const visibleProducts = useMemo(() => products.filter((product) => product.visible).length, [products]);
  const sortedProducts = useMemo(() => products.slice().sort((a, b) => a.sortOrder - b.sortOrder), [products]);

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
      const [nextProducts, nextSettings, nextLayout, nextRates, inquiryData] = await Promise.all([
        api<CmsProduct[]>('/api/admin/products'),
        api<SiteSettings>('/api/admin/site-settings'),
        api<LayoutSettings>('/api/admin/layout-settings'),
        api<ExchangeRates>('/api/admin/exchange-rates').catch(() => defaultExchangeRates),
        api<{ inquiries: Inquiry[] }>('/api/admin/inquiries').catch(() => ({ inquiries: [] })),
      ]);
      setProducts(normalizeForSave(nextProducts.map(normalizeProduct)));
      setSettings(nextSettings);
      setLayout(nextLayout);
      setRates(nextRates);
      setInquiries(inquiryData.inquiries);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '后台数据加载失败');
    }
  };

  const submitLogin = async (event: FormEvent) => {
    event.preventDefault();
    if (loginSubmitting) return;
    setMessage('');
    if (!login.username.trim() || !login.password) { setMessage('请输入管理员账号和登录密码。'); return; }
    setLoginSubmitting(true);
    try { await api('/api/admin/login', { method: 'POST', body: JSON.stringify(login) }); await refreshSession(); }
    catch (error) { setMessage(error instanceof Error ? error.message : '登录失败，请检查账号和密码。'); }
    finally { setLoginSubmitting(false); }
  };

  const submitCode = async (event: FormEvent) => {
    event.preventDefault();
    if (codeSubmitting) return;
    setMessage('');
    if (!permissionCode.trim()) { setMessage('请输入权限码。'); return; }
    setCodeSubmitting(true);
    try { await api('/api/admin/verify-code', { method: 'POST', body: JSON.stringify({ code: permissionCode }) }); await refreshSession(); }
    catch (error) { setMessage(error instanceof Error ? error.message : '权限码验证失败。'); }
    finally { setCodeSubmitting(false); }
  };
  const logout = async () => {
    await api('/api/admin/logout', { method: 'POST' });
    setSession({ loggedIn: false, username: null, codeVerified: false });
  };

  const saveProducts = async () => {
    setMessage('正在保存产品...');
    try {
      const nextProducts = normalizeForSave(products);
      await api('/api/admin/products', { method: 'PUT', body: JSON.stringify({ products: nextProducts }) });
      setProducts(nextProducts);
      setMessage('产品已保存，Vercel 会自动重新部署网站。');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '保存失败');
    }
  };

  const addOrUpdateProduct = () => {
    const id = draft.id || slugify(`${draft.category}-${draft.name}-${Date.now()}`);
    const gallery = draft.galleryImages?.length ? draft.galleryImages : [draft.image].filter(Boolean);
    const nextProduct = normalizeProduct({
      ...draft,
      id,
      categorySlug: draft.categorySlug || slugify(draft.category),
      sortOrder: Number(draft.sortOrder) || products.length + 1,
      image: draft.image || gallery[0] || '',
      galleryImages: gallery,
    });
    setProducts((current) => {
      const exists = current.some((product) => product.id === id);
      const next = exists ? current.map((product) => (product.id === id ? nextProduct : product)) : [...current, nextProduct];
      return normalizeForSave(next);
    });
    setDraft(cloneEmpty());
    setMergeIds([]);
    setMessage('已加入产品列表，请点击“保存产品”同步到网站。');
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setMessage('正在上传图片...');
        const data = await api<{ url: string }>('/api/admin/upload-image', {
          method: 'POST',
          body: JSON.stringify({ filename: file.name, contentType: file.type, base64: reader.result }),
        });
        setDraft((current) => ({ ...current, image: data.url, galleryImages: current.galleryImages?.length ? current.galleryImages : [data.url] }));
        setMessage('图片已上传，请保存产品。');
      } catch (error) {
        setMessage(error instanceof Error ? error.message : '上传失败');
      }
    };
    reader.readAsDataURL(file);
  };

  const uploadImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).slice(0, 20);
    if (!files.length) return;
    const toDataUrl = (file: File) =>
      new Promise<{ filename: string; contentType: string; base64: string }>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ filename: file.name, contentType: file.type, base64: String(reader.result) });
        reader.readAsDataURL(file);
      });
    try {
      setMessage('正在批量上传图片...');
      const payload = await Promise.all(files.map(toDataUrl));
      const data = await api<{ urls: string[] }>('/api/admin/upload-image', { method: 'POST', body: JSON.stringify({ files: payload }) });
      setDraft((current) => ({ ...current, image: current.image || data.urls[0] || '', galleryImages: [...(current.galleryImages || []), ...(data.urls || [])] }));
      setMessage(`已上传 ${data.urls.length} 张图片，可作为同款不同配色。`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '批量上传失败');
    }
  };

  const mergeSelectedIntoDraft = (removeMerged: boolean) => {
    if (!draft.id) {
      setMessage('请先点击某个目标商品的“编辑”，再执行合并。');
      return;
    }
    const selected = products.filter((product) => mergeIds.includes(product.id) && product.id !== draft.id);
    const mergedImages = Array.from(new Set([...(draft.galleryImages || []), draft.image, ...selected.flatMap((product) => product.galleryImages?.length ? product.galleryImages : [product.image])].filter(Boolean)));
    setDraft((current) => ({ ...current, galleryImages: mergedImages, image: current.image || mergedImages[0] || '' }));
    if (removeMerged) setProducts((current) => normalizeForSave(current.filter((product) => !mergeIds.includes(product.id) || product.id === draft.id)));
    setMergeIds([]);
    setMessage(removeMerged ? '已合并图片并移除被合并商品，请保存产品。' : '已合并图片，请保存产品。');
  };

  const moveProduct = (sourceId: string, targetId: string) => {
    if (!sourceId || sourceId === targetId) return;
    const list = sortedProducts.slice();
    const from = list.findIndex((product) => product.id === sourceId);
    const to = list.findIndex((product) => product.id === targetId);
    if (from < 0 || to < 0) return;
    const [item] = list.splice(from, 1);
    list.splice(to, 0, item);
    setProducts(normalizeForSave(list));
  };

  const saveSettings = async () => {
    setMessage('正在保存网站内容...');
    try {
      await api('/api/admin/site-settings', { method: 'PUT', body: JSON.stringify({ settings }) });
      setMessage('网站内容已保存，Vercel 会自动重新部署。');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '保存失败');
    }
  };

  const saveLayout = async () => {
    setMessage('正在保存排版...');
    try {
      await api('/api/admin/layout-settings', { method: 'PUT', body: JSON.stringify({ settings: layout }) });
      setMessage('排版已保存，Vercel 会自动重新部署。');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '保存失败');
    }
  };

  const saveRates = async () => {
    setMessage('正在保存汇率...');
    try {
      await api('/api/admin/exchange-rates', { method: 'PUT', body: JSON.stringify({ rates }) });
      setMessage('汇率已保存，Vercel 会自动重新部署。');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '保存失败');
    }
  };

  const addModule = () => {
    const id = `module-${Date.now()}`;
    setLayout({
      ...layout,
      sections: [...layout.sections, { id, type: 'rich-text', label: '自定义模块', visible: true, order: layout.sections.length + 1, title: '新模块', body: '在后台编辑此模块。', backgroundColor: '#ffffff', columns: 1 }],
    });
  };

  if (loading) return <AdminShell title="正在加载后台..." />;
  if (!session.loggedIn) {
    return (
      <AdminShell title="管理员登录">
        <form className="admin-card mx-auto max-w-md" onSubmit={submitLogin}>
          <AdminField label="管理员账号"><input className="input" autoComplete="username" value={login.username} onChange={(event) => setLogin({ ...login, username: event.target.value })} /></AdminField>
          <AdminField label="登录密码"><input className="input" autoComplete="current-password" type="text" value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} /></AdminField>
          <button className="admin-primary w-full disabled:cursor-not-allowed disabled:opacity-60" disabled={loginSubmitting} type="submit">{loginSubmitting ? '正在登录...' : '登录'}</button>
          {message && <p className="admin-message">{message}</p>}
        </form>
      </AdminShell>
    );
  }
  if (!session.codeVerified) {
    return (
      <AdminShell title="输入权限码">
        <form className="admin-card mx-auto max-w-md" onSubmit={submitCode}>
          <AdminField label="权限码"><input className="input" autoComplete="one-time-code" type="text" value={permissionCode} onChange={(event) => setPermissionCode(event.target.value)} /></AdminField>
          <button className="admin-primary w-full disabled:cursor-not-allowed disabled:opacity-60" disabled={codeSubmitting} type="submit">{codeSubmitting ? '正在验证...' : '进入后台'}</button>
          {message && <p className="admin-message">{message}</p>}
        </form>
      </AdminShell>
    );
  }
  return (
    <AdminShell title="临沂瑞澜森炬后台管理">
      <div className="mb-5 flex flex-col gap-3 rounded-md bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-slate-500">当前账号：{session.username}</p>
          <p className="mt-1 text-sm text-slate-500">共 {products.length} 个产品，{visibleProducts} 个已显示，已加载 {inquiries.length} 条询盘。支持多设备同时登录。</p>
        </div>
        <button className="admin-secondary" type="button" onClick={logout}><LogOut size={16} /> 退出登录</button>
      </div>
      <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
        <TabButton tab={tab} value="products" onClick={setTab} icon={<PackagePlus size={17} />} label="产品管理" />
        <TabButton tab={tab} value="inquiries" onClick={setTab} icon={<LayoutDashboard size={17} />} label="询盘数据" />
        <TabButton tab={tab} value="content" onClick={setTab} icon={<Settings size={17} />} label="网页内容" />
        <TabButton tab={tab} value="layout" onClick={setTab} icon={<LayoutDashboard size={17} />} label="网页排版" />
        <TabButton tab={tab} value="rates" onClick={setTab} icon={<Settings size={17} />} label="汇率价格" />
        <TabButton tab={tab} value="analytics" onClick={setTab} icon={<BarChart3 size={17} />} label="网站访问统计" />
      </div>
      {message && <div className="mb-5 rounded-md bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800 ring-1 ring-amber-200">{message}</div>}
      {tab === 'products' && (
        <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
          <section className="admin-card">
            <h2 className="admin-title">新增 / 修改产品</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="产品名称"><input className="input" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></AdminField>
              <AdminField label="产品分类"><input className="input" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value, categorySlug: slugify(event.target.value) })} /></AdminField>
              <AdminField label="相册 / 型号分组"><input className="input" value={draft.album} onChange={(event) => setDraft({ ...draft, album: event.target.value })} /></AdminField>
              <AdminField label="排序"><input className="input" type="number" value={draft.sortOrder} onChange={(event) => setDraft({ ...draft, sortOrder: Number(event.target.value) })} /></AdminField>
              <AdminField label="主图地址"><input className="input" value={draft.image} onChange={(event) => setDraft({ ...draft, image: event.target.value })} /></AdminField>
              <AdminField label="上传主图"><label className="admin-upload"><ImagePlus size={18} /> 选择图片<input className="hidden" type="file" accept="image/*" onChange={uploadImage} /></label></AdminField>
              <AdminField label="批量上传配色图（最多20张）"><label className="admin-upload"><ImagePlus size={18} /> 批量选择<input className="hidden" type="file" accept="image/*" multiple onChange={uploadImages} /></label></AdminField>
              <AdminField label="基础价格（USD）"><input className="input" type="number" value={draft.prices?.basePrice || 0} onChange={(event) => setDraft({ ...draft, prices: { baseCurrency: 'USD', basePrice: Number(event.target.value), priceUnit: draft.prices?.priceUnit || 'piece' } })} /></AdminField>
              <AdminField label="价格单位"><input className="input" value={draft.prices?.priceUnit || 'piece'} onChange={(event) => setDraft({ ...draft, prices: { baseCurrency: draft.prices?.baseCurrency || 'USD', basePrice: draft.prices?.basePrice || 0, priceUnit: event.target.value } })} /></AdminField>
              <AdminField label="英文名称"><input className="input" value={draft.translations?.en?.name || ''} onChange={(event) => setDraft({ ...draft, translations: { ...(draft.translations || {}), en: { ...(draft.translations?.en || {}), name: event.target.value } } })} /></AdminField>
              <AdminField label="中文名称"><input className="input" value={draft.translations?.zh?.name || ''} onChange={(event) => setDraft({ ...draft, translations: { ...(draft.translations || {}), zh: { ...(draft.translations?.zh || {}), name: event.target.value } } })} /></AdminField>
              <div className="sm:col-span-2"><AdminField label="英文描述"><textarea className="input min-h-24" value={draft.translations?.en?.description || ''} onChange={(event) => setDraft({ ...draft, translations: { ...(draft.translations || {}), en: { ...(draft.translations?.en || {}), description: event.target.value } } })} /></AdminField></div>
              <div className="sm:col-span-2"><AdminField label="中文描述"><textarea className="input min-h-24" value={draft.translations?.zh?.description || ''} onChange={(event) => setDraft({ ...draft, translations: { ...(draft.translations || {}), zh: { ...(draft.translations?.zh || {}), description: event.target.value } } })} /></AdminField></div>
              <div className="sm:col-span-2"><AdminField label="图集地址 / 配色图（一行一张）"><textarea className="input min-h-24" value={listToLines(draft.galleryImages)} onChange={(event) => { const list = linesToList(event.target.value); setDraft({ ...draft, galleryImages: list, image: list[0] || draft.image }); }} /></AdminField></div>
              <div className="sm:col-span-2"><AdminField label="规格（一行一个，格式：标签=内容）"><textarea className="input min-h-24" value={(draft.specs || []).map((spec) => `${spec.label}=${spec.value}`).join('\n')} onChange={(event) => setDraft({ ...draft, specs: linesToList(event.target.value).map((line) => { const [label, ...rest] = line.split('='); return { label: label || 'Spec', value: rest.join('=') || '' }; }) })} /></AdminField></div>
              <label className="flex items-center gap-2 pt-7 text-sm font-black"><input type="checkbox" checked={draft.visible} onChange={(event) => setDraft({ ...draft, visible: event.target.checked })} />在网站显示</label>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button className="admin-primary" type="button" onClick={addOrUpdateProduct}>添加 / 更新产品</button>
              <button className="admin-secondary" type="button" onClick={() => mergeSelectedIntoDraft(false)}>合并所选图片</button>
              <button className="admin-danger" type="button" onClick={() => mergeSelectedIntoDraft(true)}>合并并删除所选商品</button>
              <button className="admin-secondary" type="button" onClick={() => { setDraft(cloneEmpty()); setMergeIds([]); }}>清空表单</button>
            </div>
          </section>

          <section className="admin-card">
            <div className="flex items-center justify-between gap-3">
              <h2 className="admin-title">产品列表（可拖拽排序）</h2>
              <button className="admin-primary" type="button" onClick={saveProducts}><Save size={16} /> 保存产品</button>
            </div>
            <p className="mt-2 text-xs font-bold text-slate-500">拖动产品卡片即可调整前台展示顺序；勾选商品后可合并到当前编辑商品。</p>
            <div className="mt-4 grid max-h-[680px] gap-3 overflow-auto pr-1">
              {sortedProducts.map((product) => (
                <div
                  key={product.id}
                  draggable
                  onDragStart={() => setDraggingId(product.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => moveProduct(draggingId, product.id)}
                  className="grid cursor-move gap-3 rounded-md border border-slate-200 p-3 sm:grid-cols-[28px_80px_1fr_auto]"
                >
                  <input className="mt-8" type="checkbox" checked={mergeIds.includes(product.id)} onChange={(event) => setMergeIds((current) => event.target.checked ? [...current, product.id] : current.filter((id) => id !== product.id))} />
                  <img className="h-20 w-20 rounded-md bg-slate-100 object-cover" src={product.image} alt={product.name} />
                  <div>
                    <p className="font-black">{product.sortOrder}. {product.name}</p>
                    <p className="text-sm text-slate-500">{product.category} / {product.album}</p>
                    <p className="text-xs text-slate-400">图集：{product.galleryImages?.length || 0} 张</p>
                  </div>
                  <div className="flex gap-2 sm:flex-col">
                    <button className="admin-secondary" type="button" onClick={() => setDraft(product)}>编辑</button>
                    <button className="admin-danger" type="button" onClick={() => setProducts((current) => normalizeForSave(current.filter((item) => item.id !== product.id)))}><Trash2 size={15} /> 删除</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
      {tab === 'inquiries' && (
        <section className="admin-card">
          <h2 className="admin-title">客户询盘</h2>
          <div className="mt-4 grid gap-3">
            {inquiries.length === 0 && <p className="text-sm text-slate-500">暂无询盘数据。</p>}
            {inquiries.map((inquiry) => <article key={inquiry.id} className="rounded-md border border-slate-200 p-4"><div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><h3 className="font-black">{inquiry.name}</h3><span className="text-xs font-bold text-slate-500">{new Date(inquiry.createdAt).toLocaleString()}</span></div><p className="mt-2 text-sm"><b>联系方式：</b>{inquiry.contact}</p><p className="text-sm"><b>意向产品：</b>{inquiry.product}</p><p className="text-sm"><b>采购数量：</b>{inquiry.quantity}</p><p className="mt-2 text-sm leading-6 text-slate-600">{inquiry.message}</p></article>)}
          </div>
        </section>
      )}
      {tab === 'content' && (
        <section className="admin-card">
          <div className="flex items-center justify-between gap-3"><h2 className="admin-title">网页内容</h2><button className="admin-primary" type="button" onClick={saveSettings}><Save size={16} /> 保存内容</button></div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {Object.entries(settings).map(([key, value]) => (
              <AdminField key={key} label={key}>{Array.isArray(value) ? <textarea className="input min-h-24" value={value.join('\n')} onChange={(event) => setSettings({ ...settings, [key]: event.target.value.split('\n').map((item) => item.trim()).filter(Boolean) })} /> : key.toLowerCase().includes('text') || key.toLowerCase().includes('intro') || key.toLowerCase().includes('subtitle') ? <textarea className="input min-h-24" value={String(value)} onChange={(event) => setSettings({ ...settings, [key]: event.target.value })} /> : <input className="input" value={String(value)} onChange={(event) => setSettings({ ...settings, [key]: event.target.value })} />}</AdminField>
            ))}
          </div>
        </section>
      )}
      {tab === 'layout' && (
        <section className="admin-card">
          <div className="flex items-center justify-between gap-3"><h2 className="admin-title">网页排版</h2><div className="flex gap-2"><button className="admin-secondary" type="button" onClick={addModule}>添加模块</button><button className="admin-primary" type="button" onClick={saveLayout}><Save size={16} /> 保存排版</button></div></div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <AdminField label="主色"><input className="input" value={layout.primaryColor} onChange={(event) => setLayout({ ...layout, primaryColor: event.target.value })} /></AdminField>
            <AdminField label="强调色"><input className="input" value={layout.accentColor} onChange={(event) => setLayout({ ...layout, accentColor: event.target.value })} /></AdminField>
            <AdminField label="商品目录每行列数"><input className="input" type="number" min={2} max={4} value={layout.catalogColumns} onChange={(event) => setLayout({ ...layout, catalogColumns: Number(event.target.value) })} /></AdminField>
          </div>
          <div className="mt-5 grid gap-3">
            {layout.sections.slice().sort((a, b) => a.order - b.order).map((section) => (
              <div key={section.id} className="grid gap-3 rounded-md border border-slate-200 p-3 lg:grid-cols-[1fr_120px_120px_120px]">
                <div className="grid gap-3 md:grid-cols-2">
                  <AdminField label="模块名称"><input className="input" value={section.label} onChange={(event) => setLayout({ ...layout, sections: layout.sections.map((item) => item.id === section.id ? { ...item, label: event.target.value } : item) })} /></AdminField>
                  <AdminField label="模块类型"><select className="input" value={section.type || 'rich-text'} onChange={(event) => setLayout({ ...layout, sections: layout.sections.map((item) => item.id === section.id ? { ...item, type: event.target.value as LayoutSection['type'] } : item) })}>{['hero', 'category-nav', 'product-grid', 'image-text', 'benefits', 'faq', 'contact', 'rich-text'].map((type) => <option key={type} value={type}>{type}</option>)}</select></AdminField>
                  <AdminField label="标题"><input className="input" value={section.title || ''} onChange={(event) => setLayout({ ...layout, sections: layout.sections.map((item) => item.id === section.id ? { ...item, title: event.target.value } : item) })} /></AdminField>
                  <AdminField label="背景色"><input className="input" value={section.backgroundColor || ''} onChange={(event) => setLayout({ ...layout, sections: layout.sections.map((item) => item.id === section.id ? { ...item, backgroundColor: event.target.value } : item) })} /></AdminField>
                  <div className="md:col-span-2"><AdminField label="内容"><textarea className="input min-h-20" value={section.body || section.subtitle || ''} onChange={(event) => setLayout({ ...layout, sections: layout.sections.map((item) => item.id === section.id ? { ...item, body: event.target.value, subtitle: event.target.value } : item) })} /></AdminField></div>
                </div>
                <input className="input" type="number" value={section.order} onChange={(event) => setLayout({ ...layout, sections: layout.sections.map((item) => item.id === section.id ? { ...item, order: Number(event.target.value) } : item) })} />
                <label className="flex items-center gap-2 text-sm font-black"><input type="checkbox" checked={section.visible} onChange={(event) => setLayout({ ...layout, sections: layout.sections.map((item) => item.id === section.id ? { ...item, visible: event.target.checked } : item) })} />显示模块</label>
                <button className="admin-danger" type="button" onClick={() => setLayout({ ...layout, sections: layout.sections.filter((item) => item.id !== section.id) })}><Trash2 size={15} /> 删除</button>
              </div>
            ))}
          </div>
        </section>
      )}
      {tab === 'rates' && (
        <section className="admin-card">
          <div className="flex items-center justify-between gap-3"><h2 className="admin-title">汇率与价格</h2><button className="admin-primary" type="button" onClick={saveRates}><Save size={16} /> 保存汇率</button></div>
          <p className="mt-3 text-sm text-slate-500">产品价格以 USD 为基础，前台会按语言自动换算币种。</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{Object.entries(rates.rates).map(([currency, value]) => <AdminField key={currency} label={currency}><input className="input" type="number" value={value} onChange={(event) => setRates({ ...rates, rates: { ...rates.rates, [currency]: Number(event.target.value) } })} /></AdminField>)}</div>
        </section>
      )}
      {tab === 'analytics' && (
        <section className="admin-card">
          <h2 className="admin-title">网站访问统计</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">已接入 Vercel Web Analytics 和 Speed Insights。统计由 Vercel 全球边缘网络处理，不会拖慢前台访问。</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a className="rounded-md border border-slate-200 bg-field p-5 transition hover:bg-white" href="https://vercel.com/analytics" target="_blank" rel="noreferrer">
              <h3 className="text-lg font-black">访问人数与国家数据</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">查看访客数量、页面访问、国家/地区、设备来源和浏览器数据。</p>
            </a>
            <a className="rounded-md border border-slate-200 bg-field p-5 transition hover:bg-white" href="https://vercel.com/speed-insights" target="_blank" rel="noreferrer">
              <h3 className="text-lg font-black">网站速度监测</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">查看真实用户的加载速度、核心 Web 指标和慢地区表现。</p>
            </a>
          </div>
          <div className="mt-5 rounded-md bg-emerald-50 p-4 text-sm leading-7 text-emerald-900 ring-1 ring-emerald-200">
            国家访问数据查看路径：Vercel 项目 → Analytics → Visitors / Countries。若看不到数据，请在 Vercel 项目设置中确认 Web Analytics 已启用。
          </div>
        </section>
      )}    </AdminShell>
  );
}

function AdminShell({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-field text-ink">
      <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"><a className="text-sm font-black text-court" href="/">查看网站</a><span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">后台管理</span></div></header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><h1 className="mb-6 text-3xl font-black tracking-normal">{title}</h1>{children}</main>
    </div>
  );
}

function AdminField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>{children}</label>;
}

function TabButton({ tab, value, onClick, icon, label }: { tab: Tab; value: Tab; onClick: (tab: Tab) => void; icon: React.ReactNode; label: string }) {
  return <button className={tab === value ? 'admin-primary' : 'admin-secondary'} type="button" onClick={() => onClick(value)}>{icon} {label}</button>;
}

export default AdminApp;
