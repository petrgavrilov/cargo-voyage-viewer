import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { china } from './icons/china';
import { denmark } from './icons/denmark';
import { egypt } from './icons/egypt';
import { germany } from './icons/germany';
import { italy } from './icons/italy';
import { malaysia } from './icons/malaysia';
import { morocco } from './icons/morocco';
import { netherlands } from './icons/netherlands';
import { singapore } from './icons/singapore';
import { southkorea } from './icons/south-korea';
import { sweden } from './icons/sweden';

@Component({
  selector: 'app-country-flag',
  template: `<span
    *ngIf="svgContent"
    class="icon"
    [innerHTML]="svgContent"
  ></span>`,
  styles: [
    `
      .icon {
        display: inline-block;
        width: 16px;
        height: 16px;
        font-size: 0;
      }
      .icon::ng-deep svg {
        width: 16px;
        height: 16px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  standalone: true,
})
export class CountryFlagComponent implements OnChanges {
  @Input() country?: string;

  constructor(private domSanitizer: DomSanitizer) {}

  svgContent: SafeHtml | null = null;

  icons: { [name: string]: string } = {
    china,
    denmark,
    egypt,
    germany,
    morocco,
    netherlands,
    southkorea,
    singapore,
    italy,
    sweden,
    malaysia,
  };

  ngOnChanges(): void {
    const icon = this.country
      ? this.icons[this.prepareCountryKey(this.country)]
      : null;

    if (!icon) {
      console.warn(`Country flag for ${this.country} is not supported.`);
    }

    this.svgContent = icon
      ? this.domSanitizer.bypassSecurityTrustHtml(icon)
      : null;
  }

  prepareCountryKey(country: string): string {
    return country.split(' ').join('').toLowerCase();
  }
}
