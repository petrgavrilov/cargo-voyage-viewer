import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RouteItem } from '../../models/route.interface';

interface ChartData {
  name: string;
  series: { name: number | Date; value: number; tooltipText: string }[];
}

@Component({
    selector: 'app-route-speed-chart',
    templateUrl: 'route-speed-chart.component.html',
    styleUrls: ['route-speed-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgxChartsModule]
})
export class RouteSpeedChartComponent {
  @Input() route?: RouteItem | null;

  data: ChartData[] = [];

  ngOnChanges(): void {
    this.data = this.getChartData();
  }

  getChartData(): ChartData[] {
    if (!this.route?.points) {
      return [];
    }

    const formatter = new Intl.DateTimeFormat('en', {
      dateStyle: 'short',
      timeStyle: 'medium',
    });

    const series = this.route!.points.map((point) => ({
      name: point.timestamp,
      value: point.speed || 0,
      tooltipText: `
        ${point.speed} knots <br />
        ${formatter.format(new Date(point.timestamp))}
      `,
    }));

    return [
      {
        name: `Vessel's Speed`,
        series,
      },
    ];
  }

  formatXAxisTick(value: number): string {
    const formatter = new Intl.DateTimeFormat('en', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });

    return formatter.format(new Date(value));
  }
}
