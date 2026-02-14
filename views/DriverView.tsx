
import React, { useState } from 'react';
import { Driver, Distribution, DeliveryStatus, CollectionStatus, School } from '../types';
import { Card, Button } from '../components/Layout';
import { Truck, Navigation, CheckCircle, Camera, LogOut, PackageSearch, MapPin, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Props {
  drivers: Driver[];
  distributions: Distribution[];
  schools: School[];
  onLogout: () => void;
}

const DriverView: React.FC<Props> = ({ drivers, distributions, schools, onLogout }) => {
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [activeTab, setActiveTab] = useState<'kirim' | 'ambil'>('kirim');
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  const selectedDriver = drivers.find(d => d.id === selectedDriverId);
  const myDeliveries = distributions.filter(d => d.driverId === selectedDriverId);

  const updateDeliveryStatus = async (distId: string, status: DeliveryStatus, photo?: string) => {
    const updateData: any = { deliveryStatus: status };
    if (photo) updateData.deliveryPhoto = photo;
    if (status === DeliveryStatus.DELIVERED) updateData.deliveryTime = new Date().toLocaleString();
    
    await supabase.from('distributions').update(updateData).eq('id', distId);
  };

  const updateCollectionStatus = async (distId: string, status: CollectionStatus) => {
    const updateData: any = { collectionStatus: status };
    if (status === CollectionStatus.COMPLETED) updateData.collectionTime = new Date().toLocaleString();
    
    await supabase.from('distributions').update(updateData).eq('id', distId);
  };

  const handlePhotoUpload = (distId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        await updateDeliveryStatus(distId, DeliveryStatus.DELIVERED, reader.result as string);
        setUploadingFor(null);
        alert('Laporan pengiriman sukses!');
      };
      reader.readAsDataURL(file);
    }
  };

  if (!selectedDriverId) {
    return (
      <div className="min-h-screen bg-emerald-600 flex items-center justify-center p-6 text-emerald-900">
        <Card className="max-w-md w-full p-8 shadow-2xl">
          <div className="text-center mb-8"><h2 className="text-2xl font-bold">Portal Driver MBG</h2><p className="text-gray-500">Pilih profil Anda untuk bertugas</p></div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
            {drivers.length === 0 ? (
              <p className="text-center text-gray-400 py-4 italic">Belum ada data driver di sistem.</p>
            ) : drivers.map(d => (
              <button key={d.id} onClick={() => setSelectedDriverId(d.id)} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-emerald-50 rounded-2xl border border-gray-100 hover:border-emerald-200 transition-all shadow-sm">
                <div className="text-left"><p className="font-bold">{d.name}</p><p className="text-xs text-gray-500">{d.nopol}</p></div>
                <Truck className="text-emerald-600" size={20} />
              </button>
            ))}
            <Button variant="secondary" className="w-full mt-4" onClick={onLogout}>Kembali</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div><h1 className="text-lg font-bold text-emerald-600 uppercase tracking-tight">Driver <span className="text-emerald-400">Dashboard</span></h1><p className="text-xs text-gray-500 font-medium">{selectedDriver?.name} • {selectedDriver?.nopol}</p></div>
          <button onClick={() => setSelectedDriverId('')} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"><LogOut size={20} /></button>
        </div>
        <div className="flex border-t max-w-4xl mx-auto">
          <button onClick={() => setActiveTab('kirim')} className={`flex-1 py-4 text-center font-bold text-xs uppercase tracking-widest border-b-2 transition-all ${activeTab === 'kirim' ? 'border-emerald-600 text-emerald-600 bg-emerald-50/20' : 'border-transparent text-gray-400'}`}>Tugas Kirim</button>
          <button onClick={() => setActiveTab('ambil')} className={`flex-1 py-4 text-center font-bold text-xs uppercase tracking-widest border-b-2 transition-all ${activeTab === 'ambil' ? 'border-emerald-600 text-emerald-600 bg-emerald-50/20' : 'border-transparent text-gray-400'}`}>Jemput Ompreng</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-4">
        {activeTab === 'kirim' ? (
          myDeliveries.filter(d => d.deliveryStatus !== DeliveryStatus.DELIVERED).length === 0 ? (
            <div className="py-20 text-center"><PackageSearch size={48} className="mx-auto text-gray-200 mb-4" /><p className="text-gray-400 font-medium">Belum ada tugas kirim hari ini.</p></div>
          ) : myDeliveries.filter(d => d.deliveryStatus !== DeliveryStatus.DELIVERED).map(d => (
            <TaskCard key={d.id} distribution={d} school={schools.find(s => s.id === d.schoolId)} onAccept={() => updateDeliveryStatus(d.id, DeliveryStatus.ON_WAY)} onFinish={() => setUploadingFor(d.id)} status={d.deliveryStatus} />
          ))
        ) : (
          myDeliveries.filter(d => d.collectionStatus !== CollectionStatus.COMPLETED && d.collectionStatus !== CollectionStatus.IDLE).length === 0 ? (
            <div className="py-20 text-center"><PackageSearch size={48} className="mx-auto text-gray-200 mb-4" /><p className="text-gray-400 font-medium">Belum ada jemputan ompreng.</p></div>
          ) : myDeliveries.filter(d => d.collectionStatus !== CollectionStatus.COMPLETED && d.collectionStatus !== CollectionStatus.IDLE).map(d => (
            <CollectionTaskCard key={d.id} distribution={d} school={schools.find(s => s.id === d.schoolId)} onPickUp={() => updateCollectionStatus(d.id, CollectionStatus.PICKING_UP)} onFinish={() => updateCollectionStatus(d.id, CollectionStatus.COMPLETED)} />
          ))
        )}
      </main>

      <input id="camera-input" type="file" accept="image/*" className="hidden" onChange={(e) => uploadingFor && handlePhotoUpload(uploadingFor, e)} />
      
      {uploadingFor && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300 backdrop-blur-md">
          <div className="bg-emerald-500 p-6 rounded-full mb-6 animate-bounce"><Camera size={48} className="text-white" /></div>
          <h3 className="text-white text-xl font-bold mb-2">Unggah Bukti Penerimaan</h3>
          <p className="text-emerald-100/60 mb-8 max-w-xs">Silakan ambil foto makanan yang sudah diserahkan ke pihak sekolah.</p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button className="w-full py-4 text-lg shadow-lg" onClick={() => document.getElementById('camera-input')?.click()}>Buka Kamera</Button>
            <Button variant="secondary" className="w-full bg-white/10 text-white border-none hover:bg-white/20" onClick={() => setUploadingFor(null)}>Batal</Button>
          </div>
        </div>
      )}
    </div>
  );
};

const TaskCard = ({ distribution, school, onAccept, onFinish, status }: any) => (
  <Card className="relative overflow-hidden border-l-4 border-l-indigo-600 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-1">
        <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold uppercase px-2 py-0.5 rounded-full border border-indigo-200">Kirim Porsi MBG</span>
        <h4 className="text-lg font-bold mt-1">{school?.name || 'Sekolah Tidak Ditemukan'}</h4>
        <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12}/> {school?.address || 'Alamat tidak tersedia'}</p>
      </div>
      <div className="text-right">
        <p className="text-xl font-black text-emerald-600">{distribution.porsi}</p>
        <p className="text-[10px] font-bold text-gray-400 uppercase">Porsi</p>
      </div>
    </div>
    <div className="pt-4 border-t border-gray-50">
      {status === DeliveryStatus.ACCEPTED ? (
        <Button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 shadow-md" onClick={onAccept}><Navigation size={20} /> Terima & Berangkat Sekarang</Button>
      ) : (
        <Button variant="success" className="w-full py-4 shadow-md bg-emerald-500 hover:bg-emerald-600" onClick={onFinish}><CheckCircle size={20} /> Konfirmasi Tiba & Foto Bukti</Button>
      )}
    </div>
  </Card>
);

const CollectionTaskCard = ({ distribution, school, onPickUp, onFinish }: any) => (
  <Card className="border-emerald-200 border-l-4 border-l-emerald-500 shadow-sm">
    <div className="mb-4">
      <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold uppercase px-2 py-0.5 rounded-full border border-emerald-200">Jemput Wadah Ompreng</span>
      <h4 className="text-lg font-bold mt-1">{school?.name || 'Sekolah'}</h4>
      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><MapPin size={12}/> {school?.address || '-'}</p>
    </div>
    <div className="pt-4 border-t border-gray-50">
      {distribution.collectionStatus === CollectionStatus.READY ? (
        <Button className="w-full py-4 bg-emerald-500 hover:bg-emerald-600" onClick={onPickUp}><Truck size={20} /> Konfirmasi Mulai Jemput</Button>
      ) : (
        <Button variant="success" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 shadow-md" onClick={onFinish}><Package size={20} /> Wadah Berhasil Dijemput</Button>
      )}
    </div>
  </Card>
);

export default DriverView;
