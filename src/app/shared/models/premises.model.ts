import { Photos } from './photos.model';

export interface Premises {
    id: string;
    userId: string;
    country: string;
    premises: 'room' | 'studio' | '';
    city: string;
    street: string;
    streetNumber: string;
    flat: string | '';
    area: number | null;
    additionalInformations: string | '';
    heating: 'gas' | 'electric' | 'district' | '';
    fornished: boolean;
    rented: boolean;
    thumbnail: Photos;
    time: number;
  }
