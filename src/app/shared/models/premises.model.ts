export interface Premises {
    id: string;
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
    thumbnailUrl: string;
    additionalInformations: string | null;
  }
