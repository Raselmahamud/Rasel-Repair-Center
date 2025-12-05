import { RepairRequest, RequestStatus, ServiceType, Customer } from './types';

export const MOCK_REQUESTS: RepairRequest[] = [
  {
    id: '1',
    customerName: 'Alice Johnson',
    deviceType: 'Smartphone',
    brand: 'Apple',
    model: 'iPhone 13',
    issueDescription: 'Screen is cracked and touch not responding in top corner.',
    location: 'Dhanmondi, Dhaka',
    serviceType: ServiceType.HOME_SERVICE,
    status: RequestStatus.OPEN,
    createdAt: Date.now() - 10000000,
    offers: [
      {
        id: '101',
        technicianName: 'QuickFix BD',
        price: 80,
        note: 'Original screen replacement, 6 months warranty.',
        timestamp: Date.now() - 500000
      }
    ],
    aiAnalysis: 'Display assembly replacement required. Estimate: $100-$150.',
    image: 'https://picsum.photos/id/1/200/200'
  },
  {
    id: '2',
    customerName: 'Rahim Ahmed',
    deviceType: 'Laptop',
    brand: 'Dell',
    model: 'XPS 13',
    issueDescription: 'Battery not charging, light blinks amber.',
    location: 'Gulshan 1, Dhaka',
    serviceType: ServiceType.SHOP_REPAIR,
    status: RequestStatus.OPEN,
    createdAt: Date.now() - 5000000,
    offers: [],
    aiAnalysis: 'Likely battery failure or DC jack issue. Estimate: $50-$90.',
    image: 'https://picsum.photos/id/2/200/200'
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Alice Johnson',
    phone: '+8801711111111',
    email: 'alice@example.com',
    address: 'Dhanmondi, Dhaka',
    totalRepairs: 1,
    joinedAt: Date.now() - 15000000
  },
  {
    id: 'c2',
    name: 'Rahim Ahmed',
    phone: '+8801922222222',
    email: 'rahim@example.com',
    address: 'Gulshan 1, Dhaka',
    totalRepairs: 3,
    joinedAt: Date.now() - 8000000
  },
  {
    id: 'c3',
    name: 'Karim Uddin',
    phone: '+8801833333333',
    email: 'karim@test.com',
    address: 'Mirpur 10, Dhaka',
    totalRepairs: 0,
    joinedAt: Date.now() - 100000
  }
];
