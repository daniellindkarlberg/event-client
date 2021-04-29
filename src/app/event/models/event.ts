import { User } from '@user/models';
export interface Event {
  id: string;
  host: Host;
  privacy: Privacy;
  category: Category;
  name: string;
  description: string;
  location: EventLocation;
  startDate: number;
  endDate?: number;
  theme: Theme;
  photo: Photo;
  guests: Partial<User>[];
}

export interface EventLocation {
  longitude: number;
  latitude: number;
  address: string;
}

export interface Photo {
  imgUrl: string;
  thumbnailUrl: string;
  positionTop: number;
}

export interface Host {
  id: string;
  nickname: string;
  picture: string;
}

export interface Theme {
  name: string;
  primaryColor: string;
  darkMode: boolean;
}

export interface Category {
  name: string;
  value: string;
  icon: string;
}

export enum Mode {
  DARK = 'dark',
  LIGHT = 'light',
}

export enum Privacy {
  PRIVATE = 'private',
  PUBLIC = 'public',
}
