export type InsuranceType = 'health' | 'life' | 'home' | 'travel' | 'business' | 'motor' | 'machine' | 'property';
export type MotorType = 'car' | 'bike' | 'scooter' | 'truck' | 'bus';

export interface Customer {
  id: string;
  name: string;
  mobileNumber: string;
  whatsappNumber: string;
  address: string;
  insuranceType: InsuranceType;
  policyNumber?: string;
  motorType?: MotorType;
  vehicleNumber?: string;
  startDate: string;
  expiryDate: string;
  createdAt: string;
}

export interface User {
  id: string;
  mobileNumber: string;
  password: string;
  createdAt: string;
}

export const insuranceTypeLabels: Record<InsuranceType, { en: string; hi: string }> = {
  health: { en: 'Health Insurance', hi: 'स्वास्थ्य बीमा' },
  life: { en: 'Life Insurance', hi: 'जीवन बीमा' },
  home: { en: 'Home Insurance', hi: 'गृह बीमा' },
  travel: { en: 'Travel Insurance', hi: 'यात्रा बीमा' },
  business: { en: 'Business Insurance', hi: 'व्यापार बीमा' },
  motor: { en: 'Motor Insurance', hi: 'वाहन बीमा' },
  machine: { en: 'Machine Insurance', hi: 'मशीन बीमा' },
  property: { en: 'Property Insurance', hi: 'संपत्ति बीमा' },
};

export const motorTypeLabels: Record<MotorType, { en: string; hi: string }> = {
  car: { en: 'Car', hi: 'कार' },
  bike: { en: 'Bike', hi: 'बाइक' },
  scooter: { en: 'Scooter', hi: 'स्कूटर' },
  truck: { en: 'Truck', hi: 'ट्रक' },
  bus: { en: 'Bus', hi: 'बस' },
};
