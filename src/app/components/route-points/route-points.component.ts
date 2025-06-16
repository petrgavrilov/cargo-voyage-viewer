import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RoutePoint } from '../../models/route.interface';

export const POINTS_LIMIT = 8;

@Component({
    selector: 'app-route-points',
    templateUrl: 'route-points.component.html',
    styleUrls: ['route-points.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule]
})
export class RoutePointsComponent {
  @Input() points: RoutePoint[] = [];

  pointsLimit: number | undefined = POINTS_LIMIT;

  ngOnChanges(): void {
    this.pointsLimit = POINTS_LIMIT;
  }

  removeLimit(): void {
    this.pointsLimit = undefined;
  }
}
