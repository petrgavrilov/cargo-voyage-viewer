import { Port } from './port.interface';

export interface RouteFilters {
  searchTerm?: string;
  fromPortCode?: string;
  toPortCode?: string;
}

export interface RouteItem {
  id: number;
  fromPort: Port | null;
  toPort: Port | null;
  durationMs: number;
  points: RoutePoint[];
  startDate: Date;
  finishDate: Date;
  totalDistanceKm: number;
  totalDistanceNmi: number;
}

export interface RoutePoint {
  longitude: number;
  latitude: number;
  timestamp: number;
  speed: number | null;
}
