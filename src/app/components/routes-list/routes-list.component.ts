import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  input,
  Input,
  InputSignal,
  output,
  Output,
  OutputEmitterRef,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouteFilters, RouteItem } from '../../models/route.interface';
import { CountryFlagComponent } from '../country-flag/country-flag.component';

@Component({
  selector: 'app-routes-list',
  templateUrl: 'routes-list.component.html',
  styleUrls: ['routes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, CountryFlagComponent],
})
export class RoutesListComponent {
  routes: InputSignal<RouteItem[] | null | undefined> = input<
    RouteItem[] | null
  >();
  filters: InputSignal<RouteFilters | null | undefined> =
    input<RouteFilters | null>();

  setFilters: OutputEmitterRef<RouteFilters> = output<RouteFilters>();

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.setFilters.emit({ ...this.filters, searchTerm: input.value });
  }
}
