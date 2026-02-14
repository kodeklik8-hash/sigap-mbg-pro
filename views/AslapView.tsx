
import React, { useState, useEffect } from 'react';
import { School, Driver, Distribution, Complaint, Role, DeliveryStatus, CollectionStatus } from '../types';
import { Card, Button, Modal } from '../components/Layout';
import { 
  LayoutDashboard, Database, Send, Package, MessageSquare, 
  LogOut, Plus, Trash2, Edit2, Phone, Download, MapPin, Users, Truck,
  School as SchoolIcon, Shield, Clock, X, CheckCircle2, AlertTriangle, Share2, Info, ExternalLink
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { supabase } from '../lib/supabase';

interface Props {
  schools: School[];
  setSchools: React.Dispatch<React.SetStateAction<School[]>>;
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  distributions: Distribution[];
  setDistributions: React.Dispatch<React.SetStateAction<Distribution[]>>;
  complaints: Complaint[];
  onLogout: () => void;
}

const AslapView: React.FC<Props> = ({ 
  schools, drivers, distributions, complaints, onLogout 
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'master' | 'kirim' | 'ompreng' | 'pengaduan'>('dashboard');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin2026') {
      setIsLoggedIn(true);
    } else {
      alert('Username atau password salah!');
    }
  };

  const handleShareApp = () => {
    const currentUrl = window.location.origin + window.location.pathname;
    if (currentUrl.includes('blob:') || currentUrl.includes('usercontent.goog')) {
      setIsShareModalOpen(true);
    } else {
      navigator.clipboard.writeText(currentUrl);
      alert('Link Aplikasi berhasil disalin! Bagikan ke Driver atau Sekolah.');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-6 text-indigo-900">
        <Card className="max-w-md w-full p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Login Aslap MBG</h2>
            <p className="text-gray-500">Gunakan kredensial admin Anda</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input 
                type="text" 
                placeholder="masukan username" 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                placeholder="masukan password" 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full py-4 text-lg">Masuk Sekarang</Button>
            <Button variant="secondary" onClick={onLogout} className="w-full">Kembali</Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-200 p-6 sticky top-0 h-screen">
        <div className="mb-10 flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl text-white">
            <Shield size={24} />
          </div>
          <span className="text-xl font-bold uppercase tracking-tight">SIGAP MBG <span className="text-indigo-400">PRO</span></span>
        </div>
        
        <nav className="space-y-2 flex-grow">
          <SidebarLink active={activeTab === 'dashboard'} icon={<LayoutDashboard size={20}/>} label="Dashboard" onClick={() => setActiveTab('dashboard')} />
          <SidebarLink active={activeTab === 'master'} icon={<Database size={20}/>} label="Data Master" onClick={() => setActiveTab('master')} />
          <SidebarLink active={activeTab === 'kirim'} icon={<Send size={20}/>} label="Proses Kirim" onClick={() => setActiveTab('kirim')} />
          <SidebarLink active={activeTab === 'ompreng'} icon={<Package size={20}/>} label="Ambil Ompreng" onClick={() => setActiveTab('ompreng')} />
          <SidebarLink active={activeTab === 'pengaduan'} icon={<MessageSquare size={20}/>} label="Pengaduan" onClick={() => setActiveTab('pengaduan')} />
          <div className="pt-4 mt-4 border-t border-gray-50">
            <SidebarLink active={false} icon={<Share2 size={20}/>} label="Bagikan Link" onClick={handleShareApp} />
          </div>
        </nav>

        <div className="pt-6 border-t border-gray-100">
          <SidebarLink active={false} icon={<LogOut size={20}/>} label="Keluar" onClick={onLogout} danger />
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-xl font-bold text-indigo-600">SIGAP MBG</h1>
          <div className="flex gap-2">
            <button onClick={handleShareApp} className="p-2 text-indigo-600 bg-indigo-50 rounded-lg">
              <Share2 size={20} />
            </button>
            <Button variant="secondary" onClick={onLogout} className="p-2">
              <LogOut size={20} />
            </Button>
          </div>
        </header>

        <nav className="lg:hidden bg-white border-b border-gray-100 p-2 overflow-x-auto flex gap-2 no-scrollbar">
          <MobileNavLink active={activeTab === 'dashboard'} label="Dashboard" onClick={() => setActiveTab('dashboard')} />
          <MobileNavLink active={activeTab === 'master'} label="Master" onClick={() => setActiveTab('master')} />
          <MobileNavLink active={activeTab === 'kirim'} label="Kirim" onClick={() => setActiveTab('kirim')} />
          <MobileNavLink active={activeTab === 'ompreng'} label="Ompreng" onClick={() => setActiveTab('ompreng')} />
          <MobileNavLink active={activeTab === 'pengaduan'} label="Pengaduan" onClick={() => setActiveTab('pengaduan')} />
        </nav>

        <main className="p-4 md:p-8 overflow-y-auto max-w-[1440px] mx-auto w-full">
          {activeTab === 'dashboard' && <DashboardTab schools={schools} drivers={drivers} distributions={distributions} complaints={complaints} />}
          {activeTab === 'master' && <MasterDataTab schools={schools} drivers={drivers} />}
          {activeTab === 'kirim' && <ProsesKirimTab schools={schools} drivers={drivers} distributions={distributions} />}
          {activeTab === 'ompreng' && <AmbilOmprengTab distributions={distributions} schools={schools} drivers={drivers} />}
          {activeTab === 'pengaduan' && <LayananPengaduanTab complaints={complaints} schools={schools} />}
        </main>
      </div>

      <Modal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        title="Panduan Berbagi Link Publik"
      >
        <div className="space-y-6 text-indigo-900">
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex gap-4">
            <Info className="text-indigo-600 flex-shrink-0" size={24} />
            <p className="text-sm leading-relaxed">
              Anda sedang menggunakan <strong>Link Preview</strong>. Untuk membagikan aplikasi ini ke orang lain, Anda harus mendapatkan link publik dari editor.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold">Langkah-langkah:</h4>
            <ol className="list-decimal list-inside space-y-3 text-sm text-gray-600">
              <li>Klik tombol <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded font-bold">Share</span> di pojok kanan atas layar AI Studio.</li>
              <li>Pilih opsi <span className="font-bold">"Get Link"</span>.</li>
              <li>Atau buka aplikasi di jendela baru dengan mengklik ikon <ExternalLink size={14} className="inline mx-1"/>.</li>
              <li>Salin alamat web dari tab baru tersebut.</li>
            </ol>
          </div>

          <Button onClick={() => setIsShareModalOpen(false)} className="w-full py-4">
            Mengerti, Lanjutkan
          </Button>
        </div>
      </Modal>
    </div>
  );
};

const SidebarLink = ({ active, icon, label, onClick, danger }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${active ? 'bg-indigo-50 text-indigo-700 shadow-sm' : danger ? 'text-red-500 hover:bg-red-50' : 'text-gray-500 hover:bg-gray-50'}`}>
    {icon} {label}
  </button>
);

const MobileNavLink = ({ active, label, onClick }: any) => (
  <button onClick={onClick} className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all ${active ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 active:bg-gray-200'}`}>
    {label}
  </button>
);

const DashboardTab = ({ schools, drivers, distributions, complaints }: any) => {
  const totalPenerima = schools.reduce((acc: number, curr: any) => acc + (curr.studentCount || 0), 0);
  
  // Status Distribusi
  const inProgress = distributions.filter((d: any) => d.deliveryStatus !== DeliveryStatus.DELIVERED).length;
  const delivered = distributions.filter((d: any) => d.deliveryStatus === DeliveryStatus.DELIVERED).length;
  const readyPickup = distributions.filter((d: any) => d.collectionStatus === CollectionStatus.READY).length;

  const dataStats = [
    { name: 'Sekolah', val: schools.length, color: '#4F46E5' },
    { name: 'Driver', val: drivers.length, color: '#10B981' },
    { name: 'Kirim', val: distributions.length, color: '#F59E0B' },
    { name: 'Aduan', val: complaints.length, color: '#EF4444' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Monitoring</h2>
          <p className="text-gray-500">Ringkasan operasional SIGAP MBG hari ini</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={<SchoolIcon className="text-indigo-600" />} label="Sekolah" value={schools.length} />
        <StatsCard icon={<Truck className="text-emerald-600" />} label="Driver" value={drivers.length} />
        <StatsCard icon={<Users className="text-amber-600" />} label="Total Siswa" value={totalPenerima} />
        <StatsCard icon={<MessageSquare className="text-red-600" />} label="Pengaduan" value={complaints.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Status Operasional Real-time" className="lg:col-span-1">
          <div className="space-y-4">
            <StatusIndicator label="Dalam Perjalanan" count={inProgress} color="bg-amber-500" icon={<Clock size={16}/>} />
            <StatusIndicator label="Berhasil Terkirim" count={delivered} color="bg-emerald-500" icon={<CheckCircle2 size={16}/>} />
            <StatusIndicator label="Siap Jemput Ompreng" count={readyPickup} color="bg-indigo-500" icon={<Package size={16}/>} />
            <StatusIndicator label="Total Aduan Baru" count={complaints.length} color="bg-red-500" icon={<AlertTriangle size={16}/>} />
          </div>
        </Card>

        <Card title="Visualisasi Data" className="lg:col-span-2">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="val" radius={[8, 8, 0, 0]}>
                  {dataStats.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

const StatusIndicator = ({ label, count, color, icon }: any) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
    <div className="flex items-center gap-3">
      <div className={`${color} text-white p-2 rounded-lg`}>{icon}</div>
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
    <span className="text-xl font-bold">{count}</span>
  </div>
);

const MasterDataTab = ({ schools, drivers }: { schools: School[], drivers: Driver[] }) => {
  const [showSchoolForm, setShowSchoolForm] = useState(false);
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newSchool, setNewSchool] = useState({ name: '', address: '', studentCount: 0, picName: '', picWhatsapp: '' });
  const [newDriver, setNewDriver] = useState({ name: '', nopol: '', whatsapp: '' });

  const saveSchool = async (e: any) => {
    e.preventDefault();
    if (editingId) {
      await supabase.from('schools').update({ ...newSchool, updatedAt: new Date().toLocaleString() }).eq('id', editingId);
    } else {
      await supabase.from('schools').insert([{ ...newSchool, updatedAt: new Date().toLocaleString() }]);
    }
    setEditingId(null);
    setShowSchoolForm(false);
    setNewSchool({ name: '', address: '', studentCount: 0, picName: '', picWhatsapp: '' });
  };

  const saveDriver = async (e: any) => {
    e.preventDefault();
    if (editingId) {
      await supabase.from('drivers').update(newDriver).eq('id', editingId);
    } else {
      await supabase.from('drivers').insert([newDriver]);
    }
    setEditingId(null);
    setShowDriverForm(false);
    setNewDriver({ name: '', nopol: '', whatsapp: '' });
  };

  const deleteSchool = async (id: string) => {
    if (confirm('Hapus sekolah ini?')) await supabase.from('schools').delete().eq('id', id);
  };

  const deleteDriver = async (id: string) => {
    if (confirm('Hapus driver ini?')) await supabase.from('drivers').delete().eq('id', id);
  };

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Data Master Sekolah</h3>
          <Button onClick={() => setShowSchoolForm(true)}><Plus size={18} /> Tambah</Button>
        </div>
        {showSchoolForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[100] backdrop-blur-sm">
            <Card className="max-w-2xl w-full" title={editingId ? "Edit Sekolah" : "Tambah Sekolah"}>
              <form onSubmit={saveSchool} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nama Sekolah" value={newSchool.name} onChange={(v: string) => setNewSchool({...newSchool, name: v})} required />
                <Input label="Nama PIC" value={newSchool.picName} onChange={(v: string) => setNewSchool({...newSchool, picName: v})} required />
                <Input label="WhatsApp PIC" value={newSchool.picWhatsapp} onChange={(v: string) => setNewSchool({...newSchool, picWhatsapp: v})} required />
                <Input label="Jumlah Siswa" type="number" value={newSchool.studentCount.toString()} onChange={(v: string) => setNewSchool({...newSchool, studentCount: parseInt(v)})} required />
                <div className="md:col-span-2"><Input label="Alamat Lengkap" value={newSchool.address} onChange={(v: string) => setNewSchool({...newSchool, address: v})} required /></div>
                <div className="md:col-span-2 flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">Simpan Data</Button>
                  <Button variant="secondary" onClick={() => { setShowSchoolForm(false); setEditingId(null); }}>Batal</Button>
                </div>
              </form>
            </Card>
          </div>
        )}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr><th className="px-6 py-4">Sekolah</th><th className="px-6 py-4">PIC</th><th className="px-6 py-4">Aksi</th></tr>
            </thead>
            <tbody className="divide-y">
              {schools.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-10 text-center text-gray-400 italic">Belum ada data sekolah.</td></tr>
              ) : schools.map(s => (
                <tr key={s.id}>
                  <td className="px-6 py-4"><p className="font-bold">{s.name}</p><p className="text-xs text-gray-500">{s.studentCount} Siswa</p></td>
                  <td className="px-6 py-4"><p className="text-sm font-medium">{s.picName}</p><p className="text-xs text-indigo-500">{s.picWhatsapp}</p></td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => { setEditingId(s.id); setNewSchool(s); setShowSchoolForm(true); }} className="text-indigo-600 p-2 hover:bg-indigo-50 rounded-xl transition-colors"><Edit2 size={16}/></button>
                    <button onClick={() => deleteSchool(s.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Data Master Driver</h3>
          <Button onClick={() => setShowDriverForm(true)} variant="success"><Plus size={18} /> Tambah</Button>
        </div>
        {showDriverForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[100] backdrop-blur-sm">
            <Card className="max-w-md w-full" title={editingId ? "Edit Driver" : "Tambah Driver"}>
              <form onSubmit={saveDriver} className="space-y-4">
                <Input label="Nama Driver" value={newDriver.name} onChange={(v: string) => setNewDriver({...newDriver, name: v})} required />
                <Input label="Nomor Polisi (Nopol)" value={newDriver.nopol} onChange={(v: string) => setNewDriver({...newDriver, nopol: v})} required />
                <Input label="WhatsApp" value={newDriver.whatsapp} onChange={(v: string) => setNewDriver({...newDriver, whatsapp: v})} required />
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">Simpan Data</Button>
                  <Button variant="secondary" onClick={() => { setShowDriverForm(false); setEditingId(null); }}>Batal</Button>
                </div>
              </form>
            </Card>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.length === 0 ? (
             <div className="col-span-full py-10 text-center text-gray-400 italic">Belum ada data driver.</div>
          ) : drivers.map(d => (
            <Card key={d.id} className="relative group border-gray-100 hover:border-indigo-200 shadow-sm transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center"><Truck size={24} /></div>
                <div><h4 className="font-bold text-lg">{d.name}</h4><span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-mono border uppercase">{d.nopol}</span></div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1 text-xs" onClick={() => { setEditingId(d.id); setNewDriver(d); setShowDriverForm(true); }}><Edit2 size={14}/> Edit</Button>
                <Button variant="danger" className="p-2" onClick={() => deleteDriver(d.id)}><Trash2 size={16}/></Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

const ProsesKirimTab = ({ schools, drivers, distributions }: any) => {
  const [showKirimForm, setShowKirimForm] = useState(false);
  const [formData, setFormData] = useState({ schoolId: '', driverId: '' });

  const selectedSchool = schools.find((s: any) => s.id === formData.schoolId);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!formData.schoolId || !formData.driverId) return;

    await supabase.from('distributions').insert([{
      schoolId: formData.schoolId,
      driverId: formData.driverId,
      porsi: selectedSchool?.studentCount || 0,
      deliveryStatus: DeliveryStatus.ACCEPTED,
      collectionStatus: CollectionStatus.IDLE,
      timestamp: new Date().toLocaleString()
    }]);

    setShowKirimForm(false);
    setFormData({ schoolId: '', driverId: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h3 className="text-xl font-bold">Kirim Porsi MBG</h3><Button onClick={() => setShowKirimForm(true)}><Send size={18} /> Input Tugas Baru</Button></div>
      {showKirimForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[100] backdrop-blur-sm">
          <Card className="max-w-xl w-full" title="Kirim Porsi MBG">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-sm font-bold block mb-1">Sekolah Tujuan</label><select className="w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.schoolId} onChange={e => setFormData({...formData, schoolId: e.target.value})} required><option value="">Pilih Sekolah</option>{schools.map((s: any) => <option key={s.id} value={s.id}>{s.name} ({s.studentCount} porsi)</option>)}</select></div>
                <div><label className="text-sm font-bold block mb-1">Driver Penugasan</label><select className="w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.driverId} onChange={e => setFormData({...formData, driverId: e.target.value})} required><option value="">Pilih Driver</option>{drivers.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
              </div>
              <div className="flex gap-3 pt-4"><Button type="submit" className="flex-1">Kirim Penugasan</Button><Button variant="secondary" onClick={() => setShowKirimForm(false)}>Batal</Button></div>
            </form>
          </Card>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {distributions.length === 0 ? (
          <div className="col-span-full py-10 text-center text-gray-400 italic">Belum ada tugas pengiriman aktif.</div>
        ) : distributions.map((d: any) => {
          const s = schools.find((sc: any) => sc.id === d.schoolId);
          const dr = drivers.find((dv: any) => dv.id === d.driverId);
          return (
            <Card key={d.id} className="border-l-4 border-l-indigo-600 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2"><h4 className="font-bold">{s?.name || 'Sekolah'}</h4><span className={`text-[10px] px-2 py-1 rounded font-bold ${d.deliveryStatus === DeliveryStatus.DELIVERED ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{d.deliveryStatus}</span></div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 flex items-center gap-1"><Truck size={14}/> {dr?.name || 'Driver'}</p>
                <p className="text-sm font-bold text-indigo-600 flex items-center gap-1"><Package size={14}/> {d.porsi} Porsi</p>
                <p className="text-[10px] text-gray-400 italic">Diperbarui: {d.deliveryTime || d.timestamp}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const AmbilOmprengTab = ({ distributions, schools, drivers }: any) => {
  const collections = distributions.filter((d: any) => d.deliveryStatus === DeliveryStatus.DELIVERED);
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Penjemputan Ompreng</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.length === 0 ? (
          <div className="col-span-full py-10 text-center text-gray-400 italic">Belum ada ompreng yang siap dijemput.</div>
        ) : collections.map((d: any) => (
          <Card key={d.id} className={`border-l-4 ${d.collectionStatus === CollectionStatus.READY ? 'border-l-amber-500 bg-amber-50/30' : 'border-l-emerald-500'}`}>
            <h4 className="font-bold">{schools.find((s: any) => s.id === d.schoolId)?.name || 'Sekolah'}</h4>
            <div className="mt-2 space-y-1">
               <p className="text-sm text-gray-600">Status Jemput: <span className="font-bold">{d.collectionStatus}</span></p>
               <p className="text-xs text-gray-400">Driver Terakhir: {drivers.find((dv: any) => dv.id === d.driverId)?.name}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const LayananPengaduanTab = ({ complaints, schools }: any) => (
  <div className="space-y-6">
    <h3 className="text-xl font-bold">Layanan Pengaduan</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {complaints.length === 0 ? (
        <div className="col-span-full py-10 text-center text-gray-400 italic">Tidak ada laporan pengaduan saat ini.</div>
      ) : complaints.map((c: any) => (
        <Card key={c.id} className="border-red-50">
          <div className="flex justify-between items-start"><span className="text-[10px] font-bold px-2 py-1 bg-red-100 text-red-600 rounded uppercase">{c.type}</span><span className="text-[10px] text-gray-400 font-bold uppercase">{c.timestamp}</span></div>
          <h4 className="font-bold mt-2">{schools.find((s: any) => s.id === c.schoolId)?.name || 'Sekolah'}</h4>
          <p className="text-sm text-gray-600 italic bg-gray-50 p-4 rounded-xl mt-3 border border-gray-100 shadow-inner">"{c.description}"</p>
          <Button className="w-full mt-4" variant="secondary" onClick={() => window.open(`https://wa.me/${c.whatsapp}`)}><Phone size={16} /> Hubungi WhatsApp Sekolah</Button>
        </Card>
      ))}
    </div>
  </div>
);

const StatsCard = ({ icon, label, value }: any) => (
  <Card className="flex flex-col items-center text-center justify-center border-gray-50 hover:shadow-md transition-shadow">
    <div className="mb-2 p-3 bg-gray-50 rounded-2xl">{icon}</div>
    <div className="text-2xl font-black">{value}</div>
    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{label}</div>
  </Card>
);

const Input = ({ label, type = 'text', value, onChange, required }: any) => (
  <div className="w-full">
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required} className="w-full px-4 py-3 rounded-xl border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" />
  </div>
);

export default AslapView;
