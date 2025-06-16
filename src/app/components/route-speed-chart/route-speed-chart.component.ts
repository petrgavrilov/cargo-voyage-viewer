import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  Input,
  InputSignal,
  Signal,
} from '@angular/core';
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
  imports: [NgxChartsModule],
})
export class RouteSpeedChartComponent {
  route: InputSignal<RouteItem | null | undefined> = input<RouteItem | null>();
  data: Signal<ChartData[]> = computed(() => {
    const route = this.route();
    if (!route || !route.points || route.points.length === 0) {
      return [];
    }
    return this.getChartData(route);
  });
  formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  formatXAxisTick: (value: number) => string = (value: number): string => {
    return this.formatter.format(new Date(value));
  };

  private getChartData(route: RouteItem): ChartData[] {
    const formatter = new Intl.DateTimeFormat('en', {
      dateStyle: 'short',
      timeStyle: 'medium',
    });

    const series = route.points.map((point) => ({
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
}
