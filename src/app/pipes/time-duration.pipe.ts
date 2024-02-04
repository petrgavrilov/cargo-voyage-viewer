import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeDuration',
  standalone: true,
})
export class TimeDurationPipe implements PipeTransform {
  transform(milliseconds: number): string {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    seconds = seconds % 60;
    minutes = seconds >= 30 ? minutes + 1 : minutes;
    minutes = minutes % 60;
    hours = hours % 24;

    return `
      ${this.padTo2Digits(days)} days
      ${this.padTo2Digits(hours)} hrs
      ${this.padTo2Digits(minutes)} mins
    `.trim();
  }

  padTo2Digits(num: number): string {
    return num.toString().padStart(2, '0');
  }
}
