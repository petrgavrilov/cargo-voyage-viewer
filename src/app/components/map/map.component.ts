import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { GoogleMap, GoogleMapsModule, MapPolyline } from '@angular/google-maps';
import { BehaviorSubject, Subscription, combineLatest, filter } from 'rxjs';
import { RoutePoint } from '../../models/route.interface';
import { styles } from './map.theme';
import { mapsPaddings } from './map.data';
import { calculateColor, getMinMaxSpeed, winsorizePoints } from './map.helpers';

@Component({
  selector: 'app-map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [GoogleMapsModule, MapPolyline, CommonModule],
})
export class MapComponent implements OnInit, OnChanges, OnDestroy {
  @Input() points?: RoutePoint[];
  @ViewChild(GoogleMap, { static: false }) map?: GoogleMap;

  private subscription?: Subscription;

  options: google.maps.MapOptions = {
    center: { lat: 0, lng: 100 },
    zoom: 2,
    disableDefaultUI: true,
    styles,
  };

  polylines: google.maps.PolylineOptions[] = [];
  markers: google.maps.MarkerOptions[] = [];

  initialized = new BehaviorSubject<boolean>(false);
  projection = new BehaviorSubject<google.maps.Projection | null>(null);
  routePoints = new BehaviorSubject<RoutePoint[]>([]);

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    // wait until the map is initialized and the projection is available
    // then, pass the route points to the line renderer
    this.subscription = combineLatest([
      this.initialized,
      this.projection,
      this.routePoints,
    ])
      .pipe(
        filter(([initialized, projection, routePoints]) => {
          return initialized && !!projection && routePoints.length > 2;
        })
      )
      .subscribe(([, , routePoints]) => {
        this.renderLine(routePoints);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['points'] && this.points?.length) {
      this.routePoints.next(this.points);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onMapInitialized(): void {
    this.initialized.next(true);
  }

  onMapProjectionChanged(): void {
    this.projection.next(this.map?.getProjection() || null);
  }

  renderLine(points: RoutePoint[]): void {
    // polylines are used for the route's visualization
    this.polylines = this.getPolylines(points);
    // markers are used for the start and end points
    this.markers = this.getMarkers(points);

    const bounds = new google.maps.LatLngBounds();
    points.forEach((point) => {
      bounds.extend(new google.maps.LatLng(point.latitude, point.longitude));
    });

    this.map?.fitBounds(bounds, this.getMapPaddings());
  }

  private getMapPaddings(): google.maps.Padding {
    const currentWidth = this.document.body.clientWidth;

    // map paddings are used to avoid the markers to be hidden by the content section
    // there are 2 different paddings, each padding is used for a different screen width
    for (const [width, padding] of mapsPaddings) {
      if (currentWidth >= width) {
        return padding;
      }
    }

    return mapsPaddings.get(0) as google.maps.Padding;
  }

  private getMarkers(points: RoutePoint[]): google.maps.MarkerOptions[] {
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];

    return [this.getMarker(firstPoint, '1'), this.getMarker(lastPoint, '2')];
  }

  private getMarker(
    point: RoutePoint,
    text: string
  ): google.maps.MarkerOptions {
    return {
      position: {
        lat: point.latitude,
        lng: point.longitude,
      },
      label: {
        text,
        color: '#fff',
      },
    };
  }

  private getPolylines(points: RoutePoint[]): google.maps.PolylineOptions[] {
    // some points has extreme speed values
    // we need to limit them to avoid the visualization to be affected
    points = winsorizePoints(points);
    const minMaxSpeed = getMinMaxSpeed(points);

    // to color the line with different colors
    // we need to create multiple lines, each line will have a different color
    return points.reduce<google.maps.PolylineOptions[]>((lines, _, index) => {
      if (index === 0) {
        return [];
      }

      const prevPoint = points[index - 1];
      const nextPoint = points[index];

      const avgSpeed = ((nextPoint.speed || 0) + (prevPoint.speed || 0)) / 2;

      const polyLine: google.maps.PolylineOptions = {
        geodesic: true,
        path: [
          { lat: prevPoint.latitude, lng: prevPoint.longitude },
          { lat: nextPoint.latitude, lng: nextPoint.longitude },
        ],
        strokeColor: calculateColor(avgSpeed, ...minMaxSpeed),
        strokeOpacity: 1.0,
        strokeWeight: 4,
      };

      return [...lines, polyLine];
    }, []);
  }
}
