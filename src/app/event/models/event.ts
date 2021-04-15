export interface Event {
  id: string;
  host: Host;
  privacy: Privacy;
  name: string;
  description: string;
  location: EventLocation;
  startDate: number;
  endDate?: number;
  theme: Theme;
  photo: Photo;
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

export enum Mode {
  DARK = 'dark',
  LIGHT = 'light',
}

export enum Privacy {
  PRIVATE = 'private',
  PUBLIC = 'public',
}
