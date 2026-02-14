
import React, { useState } from 'react';
import { Role } from '../types';
import { ShieldCheck, Truck, School as SchoolIcon, Share2, Info, ExternalLink } from 'lucide-react';
import { Modal, Button } from '../components/Layout';

interface Props {
  onSelectRole: (role: Role) => void;
}

const LandingPage: React.FC<Props> = ({ onSelectRole }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    
    // Deteksi jika ini adalah link blob sementara
    if (currentUrl.startsWith('blob:') || currentUrl.includes('usercontent.goog')) {
      setIsShareModalOpen(true);
    } else {
      navigator.clipboard.writeText(currentUrl);
      alert('Link Aplikasi berhasil disalin! Silakan tempel (paste) di WhatsApp untuk dibagikan.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full text-center">
        <div className="mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold tracking-wide uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Platform Terintegrasi MBG
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            SIGAP <span className="text-indigo-600">MBG Pro</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sistem Integrasi & Distribusi Aslap MBG untuk menghubungkan Petugas Lapangan, 
            Driver, dan Sekolah secara real-time.
          </p>
          <div className="pt-4">
            <button 
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-indigo-100 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm active:scale-95"
            >
              <Share2 size={20} />
              Bagikan Link Aplikasi
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RoleCard 
            icon={<ShieldCheck className="w-8 h-8 text-indigo-600" />}
            title="Aslap MBG"
            description="Manajemen data master, pengiriman, dan layanan pengaduan."
            onClick={() => onSelectRole(Role.ASLAP)}
          />
          <RoleCard 
            icon={<Truck className="w-8 h-8 text-emerald-600" />}
            title="Driver"
            description="Laporan pengiriman porsi makan dan jemput ompreng."
            onClick={() => onSelectRole(Role.DRIVER)}
          />
          <RoleCard 
            icon={<SchoolIcon className="w-8 h-8 text-amber-600" />}
            title="Sekolah"
            description="Update penerima manfaat dan pantau status distribusi."
            onClick={() => onSelectRole(Role.SCHOOL)}
          />
        </div>
      </div>

      <Modal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        title="Panduan Berbagi Link Publik"
      >
        <div className="space-y-6">
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
            <Info className="text-amber-600 flex-shrink-0" size={24} />
            <p className="text-sm text-amber-800 leading-relaxed">
              Anda saat ini sedang berada di mode <strong>Preview (Sandbox)</strong>. Link <em>blob:</em> tidak bisa dibuka oleh orang lain.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900">Cara Mendapatkan Link Publik:</h4>
            <ol className="list-decimal list-inside space-y-3 text-sm text-gray-600">
              <li>Lihat ke pojok kanan atas di luar jendela aplikasi ini.</li>
              <li>Cari tombol bertanda <span className="px-2 py-0.5 bg-gray-100 rounded font-bold">Share</span> atau <span className="px-2 py-0.5 bg-gray-100 rounded font-bold">Deploy</span>.</li>
              <li>Atau klik ikon <ExternalLink size={14} className="inline mx-1"/> (Open in New Window) pada toolbar preview.</li>
              <li>Salin URL dari tab baru tersebut untuk dibagikan ke WhatsApp.</li>
            </ol>
          </div>

          <Button onClick={() => setIsShareModalOpen(false)} className="w-full py-4">
            Saya Mengerti
          </Button>
        </div>
      </Modal>
    </div>
  );
};

const RoleCard: React.FC<{ icon: React.ReactNode; title: string; description: string; onClick: () => void }> = ({ icon, title, description, onClick }) => (
  <button 
    onClick={onClick}
    className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 text-left"
  >
    <div className="mb-6 p-4 bg-gray-50 rounded-2xl group-hover:scale-110 transition-transform duration-300 inline-block">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{description}</p>
    <div className="mt-8 flex items-center text-indigo-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
      Masuk ke Dashboard
      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
    </div>
  </button>
);

export default LandingPage;
