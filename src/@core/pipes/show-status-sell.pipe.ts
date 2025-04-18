import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'showStatusSell' })
export class ShowStatusSellPipe implements PipeTransform {
  transform(value: number): string {
    let html = '';
    if (value === 1) {
      html = '<span class="badge badge-pill badge-light-success mr-1">Kích hoạt</span>';
    } else if (value === 0) {
      html = '<span class="badge badge-pill badge-light-warning mr-1">Khởi tạo</span>';
    } else if (value === -2) {
      html = '<span class="badge badge-pill badge-light-info mr-1">Khoá</span>';
    } else if (value === -1) {
      html = '<span class="badge badge-pill badge-light-danger mr-1">Hủy</span>';
    } else {
      html = '<span class="badge badge-pill mr-1 badge-light-warning">' + value + '</span>'
    }
    return html;
  }
}
