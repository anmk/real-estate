import { Photos } from './photos.model';

export interface Premises {
    id: string;
    userId: string;
    country: string;
    city: string;
    street: string;
    streetNumber: string;
    flat: string | null;
    area: number | null;
    premises: 'room' | 'studio';
    heating: 'gas' | 'electric' | 'district' | null;
    rented: boolean;
    fornished: boolean;
    thumbnail: Photos;
    additionalInformations: string | null;
    time: number;
  }
