
import React, { useState, useEffect } from 'react';
import { Role, School, Driver, Distribution, Complaint } from './types';
import LandingPage from './views/LandingPage';
import AslapView from './views/AslapView';
import DriverView from './views/DriverView';
import SchoolView from './views/SchoolView';
import { Footer, Button } from './components/Layout';
import { supabase } from './lib/supabase';
import { Database, AlertCircle, Terminal, Key } from 'lucide-react';

const App: React.FC = () => {
  const [role, setRole] = useState<Role>(Role.NONE);
  const [schools, setSchools] = useState<School[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const { data: sData, error: sError } = await supabase.from('schools').select('*');
      
      if (sError) {
        console.error("Supabase error detected:", sError);
        setIsConfigured(false);
        setLoading(false);
        return;
      }

      const [dRes, distRes, cRes] = await Promise.all([
        supabase.from('drivers').select('*'),
        supabase.from('distributions').select('*').order('created_at', { ascending: false }),
        supabase.from('complaints').select('*').order('created_at', { ascending: false })
      ]);

      setSchools(sData || []);
      setDrivers(dRes.data || []);
      setDistributions(distRes.data || []);
      setComplaints(cRes.data || []);
      setIsConfigured(true);
    } catch (err: any) {
      console.error("Critical database error:", err);
      setIsConfigured(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchData();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleLogout = () => setRole(Role.NONE);

  if (!isConfigured && !loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center">
            <div className="inline-block p-4 bg-red-500/10 rounded-full mb-4">
              <Database size={48} className="text-red-500" />
            </div>
            <h1 className="text-3xl font-bold uppercase tracking-tight">Koneksi Database Terputus</h1>
            <p className="text-gray-400 mt-2">SIGAP MBG tidak dapat terhubung ke Supabase. Periksa kredensial Anda.</p>
          </div>

          <div className="grid gap-4">
            <SetupStep 
              icon={<Terminal size={20} />} 
              title="1. Masukkan API Key yang Benar" 
              desc="Pastikan URL dan Anon Key di file lib/supabase.ts sudah benar dan tidak ada typo." 
            />
            <SetupStep 
              icon={<Key size={20} />} 
              title="2. Aktifkan Database di Supabase" 
              desc="Pastikan tabel schools, drivers, distributions, dan complaints sudah ada di dashboard Supabase Anda." 
            />
          </div>

          <div className="pt-4">
            <Button className="w-full py-4 text-lg bg-white text-black hover:bg-gray-200 font-bold" onClick={() => window.location.reload()}>
              Segarkan Halaman
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && role === Role.NONE) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium font-sans">SIGAP MBG PRO: Sinkronisasi Data...</p>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (role) {
      case Role.ASLAP:
        return (
          <AslapView 
            schools={schools} 
            setSchools={setSchools}
            drivers={drivers}
            setDrivers={setDrivers}
            distributions={distributions}
            setDistributions={setDistributions}
            complaints={complaints}
            onLogout={handleLogout}
          />
        );
      case Role.DRIVER:
        return (
          <DriverView 
            drivers={drivers}
            distributions={distributions}
            schools={schools}
            onLogout={handleLogout}
          />
        );
      case Role.SCHOOL:
        return (
          <SchoolView 
            schools={schools}
            distributions={distributions}
            complaints={complaints}
            onLogout={handleLogout}
          />
        );
      default:
        return <LandingPage onSelectRole={setRole} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-grow">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
};

const SetupStep = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="bg-gray-800/50 border border-gray-700 p-5 rounded-2xl flex gap-4 text-left">
    <div className="text-indigo-400 mt-1 flex-shrink-0">{icon}</div>
    <div>
      <h3 className="font-bold text-gray-100">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default App;
