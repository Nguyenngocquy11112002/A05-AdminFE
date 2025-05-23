import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'showStatus'})
export class ShowStatusPipe implements PipeTransform {
  transform(value: number): string {
    let html = '';
    if(value == 1) {
        html = '<span class="badge badge-pill badge-light-success mr-1">Đang hoạt động</span>'
    } else if (value === 0) {
        html = '<span class="badge badge-pill badge-light-warning mr-1">Đang khóa</span>'
    } else if (value === 2) {
      html = '<span class="badge badge-pill badge-light-info mr-1">Đã duyệt</span>'
    }else{
        html =  '<span class="badge badge-pill mr-1 badge-light-warning">' + value + '</span>'
    }
    return html;
  }
}