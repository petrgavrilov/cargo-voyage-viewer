import { inject, Injectable } from '@angular/core';
import { Observable, forkJoin, map, of, shareReplay } from 'rxjs';
import { PortDataItem, RouteDataItem } from '../models/data.interface';
import { Port } from '../models/port.interface';
import { RouteFilters, RouteItem, RoutePoint } from '../models/route.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DataService {
  private dateFormatter = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'long',
  });

  private dataCache = new Map<string, unknown>();
  private routeItemsCache = new Map<number, RouteItem>();
  private searchStringCache = new Map<number, string>();

  private httpClient: HttpClient = inject(HttpClient);

  loadJsonData$<T>(name: string): Observable<T> {
    if (!this.dataCache.has(name)) {
      this.dataCache.set(
        name,
        this.httpClient
          .get<T>(`./assets/data/${name}.json`)
          .pipe(shareReplay(1))
      );
    }

    return this.dataCache.get(name) as Observable<T>;
  }

  loadPortsData$(): Observable<PortDataItem[]> {
    return this.loadJsonData$<PortDataItem[]>('ports');
  }

  loadRoutesData$(): Observable<RouteDataItem[]> {
    return this.loadJsonData$<RouteDataItem[]>('routes');
  }

  getRouteById$(id: number): Observable<RouteItem | null> {
    return forkJoin([this.loadRoutesData$(), this.loadPortsData$()]).pipe(
      map(([routesData, portsData]) => {
        const route = routesData.find(({ route_id }) => route_id === id);
        return route ? this.prepareRouteItem(route, portsData) : null;
      })
    );
  }

  getPrevNextRoutes$(
    id: number,
    filters: RouteFilters
  ): Observable<RouteItem[]> {
    return this.getRoutes$(filters).pipe(
      map((routes) => {
        const routeIndex = routes.findIndex((route) => route.id === id);
        const prevRoute =
          routeIndex > 0 ? routes[routeIndex - 1] : routes[routes.length - 1];
        const nextRoute =
          routeIndex < routes.length - 1 ? routes[routeIndex + 1] : routes[0];
        return [prevRoute, nextRoute];
      })
    );
  }

  getPortInfo$(code: string): Observable<Port | null> {
    return this.loadPortsData$().pipe(
      map((portsData) => {
        const portData = portsData.find((port) => port.code === code);
        return portData || null;
      })
    );
  }

  filterFuncs = [
    (item: RouteItem, filters: RouteFilters) =>
      this.filterBySearchTerm(item, filters),
  ];

  getRoutes$(filters: RouteFilters): Observable<RouteItem[]> {
    return forkJoin([this.loadRoutesData$(), this.loadPortsData$()]).pipe(
      map(([routesData, portsData]) => {
        const items = routesData.map((data) =>
          this.prepareRouteItem(data, portsData)
        );
        const filteredItems = items.filter((item) => {
          return this.filterFuncs.every((filterFunc) =>
            filterFunc(item, filters)
          );
        });

        return filteredItems;
      })
    );
  }

  private filterBySearchTerm(item: RouteItem, filters: RouteFilters): boolean {
    return filters.searchTerm?.trim()
      ? this.prepareSearchString(item).includes(
          filters.searchTerm?.toLowerCase().trim()
        )
      : true;
  }

  private prepareSearchString(item: RouteItem): string {
    if (this.searchStringCache.has(item.id)) {
      return this.searchStringCache.get(item.id) as string;
    }

    const { points, startDate, finishDate, toPort, fromPort, ...rest } = item;

    const values = [
      this.dateFormatter.format(startDate),
      this.dateFormatter.format(finishDate),
      ...Object.values(fromPort || {}),
      ...Object.values(toPort || {}),
      ...Object.values(rest),
    ];

    const searchString = values.join(' ').toLowerCase();
    this.searchStringCache.set(item.id, searchString);
    return searchString;
  }

  private prepareRouteItem(
    routeData: RouteDataItem,
    portsData: PortDataItem[]
  ): RouteItem {
    if (this.routeItemsCache.has(routeData.route_id)) {
      return this.routeItemsCache.get(routeData.route_id) as RouteItem;
    }

    const fromPort =
      portsData.find(({ code }) => code === routeData.from_port) || null;
    const toPort =
      portsData.find(({ code }) => code === routeData.to_port) || null;
    const points = this.prepareRoutePoints(routeData);
    const totalDistanceKm = this.calculateTotalDistanceInKm(points);
    const totalDistanceNmi = totalDistanceKm * 0.539957;

    const item: RouteItem = {
      id: routeData.route_id,
      durationMs: routeData.leg_duration,
      fromPort,
      toPort,
      points,
      startDate: new Date(points[0].timestamp),
      finishDate: new Date(points[points.length - 1].timestamp),
      totalDistanceKm,
      totalDistanceNmi,
    };

    this.routeItemsCache.set(routeData.route_id, item);
    return item;
  }

  private prepareRoutePoints(routeData: RouteDataItem): RoutePoint[] {
    return routeData.points
      .map(([longitude, latitude, timestamp, speed]) => ({
        longitude,
        latitude,
        timestamp,
        speed,
      }))
      .sort((prev, next) => prev.timestamp - next.timestamp);
  }

  private calculateTotalDistanceInKm(points: RoutePoint[]): number {
    const R = 6371; // Radius of the earth in km
    let totalDistance = 0;

    for (let i = 0; i < points.length - 1; i++) {
      let point1 = points[i];
      let point2 = points[i + 1];

      let dLat = this.deg2rad(point2.latitude - point1.latitude);
      let dLon = this.deg2rad(point2.longitude - point1.longitude);

      let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(point1.latitude)) *
          Math.cos(this.deg2rad(point2.latitude)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      let distance = R * c; // Distance in km
      totalDistance += distance;
    }

    return totalDistance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
