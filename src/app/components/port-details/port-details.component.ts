import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Port } from '../../models/port.interface';

@Component({
  selector: 'app-port-details',
  templateUrl: 'port-details.component.html',
  styleUrls: ['port-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgxChartsModule],
})
export class PortDetailsComponent implements OnChanges {
  @Input() port: Port | null = null;

  description: string[] = [];

  ngOnChanges(): void {
    this.description = (this.port?.description.split('\n') || []).filter(
      (text) => text?.trim().length > 0
    );
  }
}
