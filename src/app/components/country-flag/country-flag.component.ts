import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  InputSignal,
  Signal,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as icons from './icons';

@Component({
  selector: 'app-country-flag',
  templateUrl: 'country-flag.component.html',
  styleUrls: ['country-flag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class CountryFlagComponent {
  country: InputSignal<string | undefined> = input<string>();
  svgContent: Signal<SafeHtml | null> = computed(() => {
    const country = this.country();
    return country ? this.getIcon(country) : null;
  });

  icons: { [name: string]: string } = icons;
  private domSanitizer: DomSanitizer = inject(DomSanitizer);

  private getIcon(country: string): SafeHtml | null {
    const icon = country ? this.icons[this.prepareCountryKey(country)] : null;

    if (!icon) {
      console.warn(`Country flag for ${this.country} is not supported.`);
    }

    return icon ? this.domSanitizer.bypassSecurityTrustHtml(icon) : null;
  }

  private prepareCountryKey(country: string): string {
    return country.split(' ').join('').toLowerCase();
  }
}
