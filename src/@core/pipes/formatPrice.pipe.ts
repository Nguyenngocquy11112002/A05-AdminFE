import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'formatPrice'})
export class FormatPricePipe implements PipeTransform {
  transform(value: any): string {
    return value.toLocaleString('vi-VN', {style : 'currency', currency : 'VND'});
  }
}