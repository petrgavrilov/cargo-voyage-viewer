import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MapComponent } from '../../components/map/map.component';
import { RootComponent } from '../../components/root/root.component';
import { RoutesListComponent } from '../../components/routes-list/routes-list.component';
import { DataService } from '../../services/data.service';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { RouteFilters, RouteItem } from '../../models/route.interface';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-routes-page',
  template: `
    <app-routes-root>
      <app-map></app-map>
      <app-routes-list
        [routes]="routes$ | async"
        [filters]="filters$ | async"
        (setFilters)="onSetFilters($event)"
      ></app-routes-list>
    </app-routes-root>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RootComponent, MapComponent, RoutesListComponent],
})
export class RoutesPageComponent {
  routes$!: Observable<RouteItem[]>;

  private filters = new BehaviorSubject<RouteFilters>({});
  filters$ = this.filters.asObservable();

  constructor(
    private dataService: DataService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routes$ = this.filters.pipe(
      switchMap((filters) => this.dataService.getRoutes$(filters))
    );

    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.filters.next(queryParams);
  }

  onSetFilters(filters: RouteFilters): void {
    this.filters.next(filters);
    this.router.navigate([], {
      queryParams: filters,
      queryParamsHandling: 'merge',
    });
  }
}
