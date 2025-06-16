import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RouteFilters, RouteItem } from '../../models/route.interface';
import { TimeDurationPipe } from '../../pipes/time-duration.pipe';
import { CountryFlagComponent } from '../country-flag/country-flag.component';
import { RouteSpeedChartComponent } from '../route-speed-chart/route-speed-chart.component';
import { PortDetailsComponent } from '../port-details/port-details.component';
import { Port } from '../../models/port.interface';
import { RoutePointsComponent } from '../route-points/route-points.component';

@Component({
    selector: 'app-route-details',
    templateUrl: 'route-details.component.html',
    styleUrls: ['route-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        RouterModule,
        TimeDurationPipe,
        CountryFlagComponent,
        RouteSpeedChartComponent,
        PortDetailsComponent,
        RoutePointsComponent,
    ]
})
export class RouteDetailsComponent implements OnChanges {
  @Input() route?: RouteItem | null;
  @Input() filters: RouteFilters | null = {};
  @Input() prevNextRoutes: RouteItem[] = [];

  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;

  activePort: Port | null = null;

  private router = inject(Router);

  ngOnChanges(): void {
    this.root?.nativeElement?.scrollTo(0, 0);
    this.activePort = null;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      this.prevNextRoutes[0] && this.navigateToRoute(this.prevNextRoutes[0]);
    }
    if (event.key === 'ArrowRight') {
      this.prevNextRoutes[1] && this.navigateToRoute(this.prevNextRoutes[1]);
    }
  }

  navigateToRoute(route: RouteItem): void {
    this.router.navigate(['/routes/', route.id], {
      queryParams: this.filters,
    });
  }

  setActivePort(port: Port): void {
    if (this.activePort === port) {
      this.activePort = null;
    } else {
      this.activePort = port;
    }
  }
}
