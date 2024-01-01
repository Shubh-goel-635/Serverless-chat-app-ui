import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'TimeStampToTime'
})
export class TimeStampToTimePipe implements PipeTransform {

  transform(value: number): unknown {
    const date = new Date(value);
    const time = ((date.getHours()<10)? ('0' + date.getHours().toLocaleString()) :  (date.getHours().toLocaleString())) + ':' + ((date.getMinutes()<10)? ('0' + date.getMinutes().toLocaleString()) :  (date.getMinutes().toLocaleString()));
    return time;
  }

}
