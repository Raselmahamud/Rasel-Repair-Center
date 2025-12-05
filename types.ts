export enum RequestStatus {
  OPEN = 'OPEN',
  OFFER_ACCEPTED = 'OFFER_ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED'
}

export enum ServiceType {
  HOME_SERVICE = 'Home Service',
  SHOP_REPAIR = 'Shop Repair (Pickup/Dropoff)'
}

export type Priority = 'NORMAL' | 'URGENT';

export interface Offer {
  id: string;
  technicianName: string;
  price: number;
  note: string;
  timestamp: number;
}

export interface RepairRequest {
  id: string;
  customerName: string;
  contactPhone: string;
  contactEmail: string;
  deviceType: string; // e.g., Phone, Laptop
  brand: string;
  model: string;
  issueDescription: string;
  location: string;
  serviceType: ServiceType;
  priority: Priority;
  status: RequestStatus;
  createdAt: number;
  offers: Offer[];
  aiAnalysis?: string;
  image?: string; // base64 placeholder
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  totalRepairs: number;
  joinedAt: number;
}

export type ViewState = 'DASHBOARD' | 'REQUESTS_LIST' | 'CREATE_TICKET' | 'JOB_BOARD' | 'CUSTOMERS';
