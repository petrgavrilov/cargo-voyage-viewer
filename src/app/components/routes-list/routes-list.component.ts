import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouteFilters, RouteItem } from '../../models/route.interface';
import { TimeDurationPipe } from '../../pipes/time-duration.pipe';
import { CountryFlagComponent } from '../country-flag/country-flag.component';

@Component({
  selector: 'app-routes-list',
  templateUrl: 'routes-list.component.html',
  styleUrls: ['routes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterModule, TimeDurationPipe, CountryFlagComponent],
})
export class RoutesListComponent {
  @Input() routes: RouteItem[] | null = [];
  @Input() filters: RouteFilters | null = {};

  @Output() setFilters = new EventEmitter<RouteFilters>();

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.setFilters.emit({ ...this.filters, searchTerm: input.value });
  }

  trackRouteById(_: number, route: RouteItem): number {
    return route.id;
  }
}
