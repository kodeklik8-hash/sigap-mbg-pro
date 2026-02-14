
import React, { useState } from 'react';
import { School, Distribution, Complaint, DeliveryStatus, CollectionStatus } from '../types';
import { Card, Button } from '../components/Layout';
import { Users, Bell, MessageCircle, LogOut, CheckCircle2, History, Camera } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Props {
  schools: School[];
  distributions: Distribution[];
  complaints: Complaint[];
  onLogout: () => void;
}

const SchoolView: React.FC<Props> = ({ schools, distributions, onLogout }) => {
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [activeTab, setActiveTab] = useState<'status' | 'data' | 'pengaduan'>('status');

  const selectedSchool = schools.find(s => s.id === selectedSchoolId);
  const myDist = distributions.filter(d => d.schoolId === selectedSchoolId).pop();
  const [studentInput, setStudentInput] = useState(0);

  const updateStudentCount = async () => {
    await supabase.from('schools').update({ studentCount: studentInput, updatedAt: new Date().toLocaleString() }).eq('id', selectedSchoolId);
    alert('Jumlah porsi diperbarui!');
  };

  const setWadahReady = async () => {
    if (myDist) {
      await supabase.from('distributions').update({ collectionStatus: CollectionStatus.READY }).eq('id', myDist.id);
      alert('Driver diberitahu untuk jemput wadah!');
    }
  };

  const handleSendComplaint = async (e: any) => {
    e.preventDefault();
    await supabase.from('complaints').insert([{
      schoolId: selectedSchoolId,
      type: e.target.type.value,
      description: e.target.description.value,
      whatsapp: selectedSchool?.picWhatsapp || '',
      timestamp: new Date().toLocaleString()
    }]);
    alert('Aduan dikirim!');
    setActiveTab('status');
  };

  if (!selectedSchoolId) {
    return (
      <div className="min-h-screen bg-amber-500 flex items-center justify-center p-6 text-amber-900">
        <Card className="max-w-md w-full p-8">
          <div className="text-center mb-8"><h2 className="text-2xl font-bold">Portal Sekolah</h2><p className="text-gray-500">Pilih sekolah Anda</p></div>
          <div className="space-y-4">
            {schools.map(s => (
              <button key={s.id} onClick={() => { setSelectedSchoolId(s.id); setStudentInput(s.studentCount); }} className="w-full flex justify-between p-4 bg-gray-50 hover:bg-amber-50 rounded-2xl border transition-all">
                <div className="text-left"><p className="font-bold">{s.name}</p><p className="text-xs text-gray-500">PIC: {s.picName}</p></div>
                <Users className="text-amber-500" size={20} />
              </button>
            ))}
            <Button variant="secondary" className="w-full mt-4" onClick={onLogout}>Kembali</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white border-b sticky top-0 z-10 px-4 py-4">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <div><h1 className="text-lg font-bold text-amber-600">{selectedSchool?.name}</h1><p className="text-[10px] text-gray-400 font-bold">Penerima: {selectedSchool?.studentCount}</p></div>
          <button onClick={() => setSelectedSchoolId('')} className="p-2 text-gray-400"><LogOut size={20} /></button>
        </div>
      </header>
      <main className="max-w-xl mx-auto p-4 space-y-6">
        {activeTab === 'status' && (
          <div className="space-y-6">
            <Card title="Status Hari Ini">
              {!myDist ? <p className="text-gray-400 italic text-center py-10">Belum ada pengiriman.</p> : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-amber-50 p-4 rounded-2xl"><p className="font-bold">Pengiriman</p><span className="bg-white px-3 py-1 rounded-full text-xs font-bold">{myDist.deliveryStatus}</span></div>
                  {myDist.deliveryStatus === DeliveryStatus.DELIVERED && myDist.collectionStatus === CollectionStatus.IDLE && (
                    <Button className="w-full py-4" onClick={setWadahReady}>Wadah Siap Dijemput</Button>
                  )}
                </div>
              )}
            </Card>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setActiveTab('data')} className="p-6 bg-white rounded-3xl border flex flex-col items-center"><Users className="text-blue-500 mb-2" /><span className="text-xs font-bold">Ubah Porsi</span></button>
              <button onClick={() => setActiveTab('pengaduan')} className="p-6 bg-white rounded-3xl border flex flex-col items-center"><MessageCircle className="text-red-500 mb-2" /><span className="text-xs font-bold">Lapor Menu</span></button>
            </div>
          </div>
        )}
        {activeTab === 'data' && (
          <Card title="Jumlah Penerima">
            <input type="number" className="w-full text-4xl font-black text-center py-8 rounded-3xl bg-gray-50 border-none mb-4" value={studentInput} onChange={e => setStudentInput(parseInt(e.target.value))} />
            <Button className="w-full py-4" onClick={updateStudentCount}>Simpan</Button>
            <Button variant="secondary" className="w-full mt-2" onClick={() => setActiveTab('status')}>Batal</Button>
          </Card>
        )}
        {activeTab === 'pengaduan' && (
          <Card title="Kirim Aduan">
            <form onSubmit={handleSendComplaint} className="space-y-4">
              <select name="type" className="w-full p-4 rounded-xl bg-gray-50 border" required><option value="Rusak">Makanan Rusak</option><option value="Kurang">Porsi Kurang</option></select>
              <textarea name="description" className="w-full p-4 h-32 rounded-xl bg-gray-50 border" placeholder="Detail..." required></textarea>
              <Button type="submit" variant="danger" className="w-full py-4">Kirim Laporan</Button>
            </form>
          </Card>
        )}
      </main>
    </div>
  );
};

export default SchoolView;
