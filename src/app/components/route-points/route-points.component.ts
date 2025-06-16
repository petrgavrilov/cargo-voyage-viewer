import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  InputSignal,
  linkedSignal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { RoutePoint } from '../../models/route.interface';

export const POINTS_LIMIT = 8;

@Component({
  selector: 'app-route-points',
  templateUrl: 'route-points.component.html',
  styleUrls: ['route-points.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class RoutePointsComponent {
  points: InputSignal<RoutePoint[]> = input.required<RoutePoint[]>();
  pointsLimit: WritableSignal<number> = linkedSignal({
    source: () => this.points(),
    computation: (pts) => POINTS_LIMIT,
  });
  limitedPoints: Signal<RoutePoint[]> = computed(() => {
    return this.getLimitedPoints(this.points(), this.pointsLimit());
  });

  removeLimit(): void {
    this.pointsLimit.set(Infinity);
  }

  private getLimitedPoints(points: RoutePoint[], limit: number): RoutePoint[] {
    if (!points || points.length === 0) {
      return [];
    }
    if (limit === Infinity) {
      return points;
    }
    return points.slice(0, limit);
  }
}
