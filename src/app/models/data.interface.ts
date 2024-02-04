export interface RouteDataItem {
  route_id: number;
  from_port: string;
  to_port: string;
  leg_duration: number;
  points: [number, number, number, number | null][];
}

export interface PortDataItem {
  code: string;
  category: string;
  city: string;
  country: string;
  description: string;
  longitude: number;
  latitude: number;
  timezone: string;
  name: string;
  type: string;
}
