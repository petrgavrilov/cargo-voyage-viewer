import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { MapComponent } from '../../components/map/map.component';
import { RootComponent } from '../../components/root/root.component';
import { RouteDetailsComponent } from '../../components/route-details/route-details.component';
import { RouteFilters, RouteItem } from '../../models/route.interface';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-route-page',
  template: `
    <app-routes-root>
      <app-map [points]="(route$ | async)?.points || []"></app-map>
      <app-route-details
        [filters]="filters"
        [route]="route$ | async"
        [prevNextRoutes]="(prevNextRoutes$ | async) || []"
      ></app-route-details>
    </app-routes-root>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouteDetailsComponent, MapComponent, RootComponent],
})
export class RoutePageComponent implements OnInit {
  route$!: Observable<RouteItem | null>;
  prevNextRoutes$!: Observable<RouteItem[]>;
  filters: RouteFilters = {};

  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private dataService: DataService = inject(DataService);

  ngOnInit(): void {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.filters = queryParams;

    const routeId$ = this.activatedRoute.params.pipe(
      map((params) => {
        const id = parseInt(params['id'], 10);
        return isNaN(id) ? 0 : id;
      })
    );

    this.route$ = routeId$.pipe(
      switchMap((id) => this.dataService.getRouteById$(id))
    );

    this.prevNextRoutes$ = routeId$.pipe(
      switchMap((id) => this.dataService.getPrevNextRoutes$(id, this.filters))
    );
  }
}
