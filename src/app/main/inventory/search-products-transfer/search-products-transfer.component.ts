import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService } from 'app/auth/service/inventory.service';
import { BatchType, ProductStatus } from 'app/utils/constants';
import dayjs from 'dayjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-search-products-transfer',
  templateUrl: './search-products-transfer.component.html',
  styleUrls: ['./search-products-transfer.component.scss']
})
export class SearchProductsTransferComponent implements OnInit {

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  public contentHeader: any = {
    headerTitle: 'Danh sách sim số',
    actionButton: true,
    breadcrumb: {
      type: '',
      links: [
        {
          name: 'Home',
          isLink: true,
          link: '/'
        },
        {
          name: 'Danh sách sim số',
          isLink: false
        }
      ]
    }
  };
  public list: any;
  public totalItems: number;
  public searchForm: any = {
    page: 1,
    page_size: 20,
    status: '',
    type: BatchType.INPUT,
    date_range: '',
    category_id: 2,
    keysearch: '',
  }
  productStatus;
  dateRange: any;
  submitted: boolean = false;
  batchType = BatchType;
  modalRef;
  showChannel;

  ranges: any = {
    'Hôm nay': [dayjs(), dayjs()],
    'Hôm qua': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Tuần vừa qua': [dayjs().subtract(6, 'days'), dayjs()],
    'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Tháng trước': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }

  constructor(
    private readonly inventoryService: InventoryService,
    private readonly router: Router,
    private readonly activeRouted: ActivatedRoute,
    private modalService: NgbModal,
  ) {
    this.productStatus = Object.keys(ProductStatus).filter(p => !Number.isInteger(parseInt(p))).reduce((obj, key) => {
      obj[key] = ProductStatus[key];
      return obj;
    }, {});
    this.activeRouted.queryParams.subscribe(params => {
      this.searchForm.type = params['type'] && params['type'] != undefined ? params['type'] : this.batchType.INPUT;
      this.searchForm.category_id = params['category_id'] && params['category_id'] != undefined ? params['category_id'] : 2;
      this.searchForm.keysearch = params['keysearch'] && params['keysearch'] != undefined ? params['keysearch'] : '';
      if(!params['date_range']) {
        this.initDefaultDateRange();
      } else {
        this.searchForm.date_range = params['date_range'];
      }
      
      this.getData();
    })
   }

  ngOnInit(): void {
  }

  onSubmitSearch() {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate 
    ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0,10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0,10) : '';
    this.searchForm.date_range = daterangeString;
    this.router.navigate(['/inventory/search-product-transfer'], { queryParams: this.searchForm});
  }

  initDefaultDateRange() {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let currentDate = new Date(new Date().getTime() - tzoffset);
    let firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let lastDay  = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    this.dateRange = {
      startDate: firstDay,
      endDate: lastDay
    }
    
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate 
    ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0,10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0,10) : '';
    this.searchForm.date_range = daterangeString;
  }

  modalChannelOpen(modal, item) {
    if (item) {
      const sub_channel_id = item.sub_channel_id ? item.sub_channel_id : ( item.sell_channels && item.sell_channels[0] ? item.sell_channels[0].sub_channel_id : '' )
      if(sub_channel_id) {
        this.inventoryService.viewDetailSell(item.sub_channel_id).subscribe(res => {
          this.showChannel = res.data.items[0];
  
          this.modalRef = this.modalService.open(modal, {
            centered: true,
            windowClass: 'modal modal-primary',
            size: 'sm'
          });
  
        })
      }
      
    }
  }

  getData() {
    this.sectionBlockUI.start();
    this.inventoryService.searchProductsTransfer(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      this.totalItems = res.data.count;
    }, error => {
      this.sectionBlockUI.stop();
    })
  }

}
