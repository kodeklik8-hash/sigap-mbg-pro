
export enum Role {
  NONE = 'NONE',
  ASLAP = 'ASLAP',
  DRIVER = 'DRIVER',
  SCHOOL = 'SCHOOL'
}

export interface School {
  id: string;
  name: string;
  address: string;
  studentCount: number;
  picName: string;
  picWhatsapp: string;
  updatedAt: string;
}

export interface Driver {
  id: string;
  name: string;
  nopol: string;
  whatsapp: string;
}

export enum DeliveryStatus {
  IDLE = 'Belum Diproses',
  ACCEPTED = 'Tugas Diterima',
  ON_WAY = 'Sedang Dalam Perjalanan',
  DELIVERED = 'Sudah Diterima'
}

export enum CollectionStatus {
  IDLE = 'Menunggu',
  READY = 'Siap Dijemput',
  PICKING_UP = 'Dalam Penjemputan',
  COMPLETED = 'Selesai'
}

export interface Distribution {
  id: string;
  schoolId: string;
  driverId: string;
  porsi: number;
  deliveryStatus: DeliveryStatus;
  collectionStatus: CollectionStatus;
  deliveryPhoto?: string;
  deliveryTime?: string;
  collectionTime?: string;
  timestamp: string;
}

export interface Complaint {
  id: string;
  schoolId: string;
  type: string;
  description: string;
  photo?: string;
  whatsapp: string;
  timestamp: string;
}
