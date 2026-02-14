
import { School, Driver, Distribution, Complaint, DeliveryStatus, CollectionStatus } from './types';

// Initial Mock Data
export const INITIAL_SCHOOLS: School[] = [
  {
    id: 's1',
    name: 'SDN 01 Merdeka',
    address: 'Jl. Proklamasi No. 12',
    studentCount: 250,
    picName: 'Bapak Ahmad',
    picWhatsapp: '628123456789',
    updatedAt: new Date().toLocaleString()
  },
  {
    id: 's2',
    name: 'SMPN 05 Harapan',
    address: 'Jl. Pemuda No. 45',
    studentCount: 420,
    picName: 'Ibu Siti',
    picWhatsapp: '628123456780',
    updatedAt: new Date().toLocaleString()
  }
];

export const INITIAL_DRIVERS: Driver[] = [
  {
    id: 'd1',
    name: 'Budi Santoso',
    nopol: 'B 1234 AB',
    whatsapp: '628987654321'
  },
  {
    id: 'd2',
    name: 'Eko Wahyudi',
    nopol: 'B 5678 CD',
    whatsapp: '628987654322'
  }
];

export const INITIAL_DISTRIBUTIONS: Distribution[] = [];
export const INITIAL_COMPLAINTS: Complaint[] = [];
