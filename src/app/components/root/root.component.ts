import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-routes-root',
  templateUrl: 'root.component.html',
  styleUrls: ['root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RootComponent {}
