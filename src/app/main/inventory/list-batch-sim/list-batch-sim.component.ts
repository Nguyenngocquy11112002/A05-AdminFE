import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service';
import { ProductStatus, STORAGE_KEY, TaskTelecom, TaskTelecomStatus } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { environment } from 'environments/environment';
import { AdminService } from 'app/auth/service/admin.service';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import dayjs from 'dayjs';
import { GtalkService } from 'app/auth/service/gtalk.service';
import { InventoryService } from 'app/auth/service/inventory.service';

@Component({
  selector: 'app-list-batch-sim',
  templateUrl: './list-batch-sim.component.html',
  styleUrls: ['./list-batch-sim.component.scss']
})
export class ListBatchSimComponent implements OnInit {

  public contentHeader: any = {
    headerTitle: 'Yêu cầu của đại lý',
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
          name: 'Yêu cầu của đại lý',
          isLink: false
        }
      ]
    }
  };
  public list: any;
  public totalItems: number;
  public summaryTask: any;

  public isActivedBoxNewInit: boolean = false;
  public isActivedBoxNewProcessing: boolean = false;
  public isActivedBoxUpdateInit: boolean = false;
  public isActivedBoxUpdateProcessing: boolean = false;
  public isActivedBoxChangeSimInit: boolean = false;
  public isActivedBoxChangeSimProcessing: boolean = false;

  public listTaskAction = TaskTelecom.ACTION;
  public taskTelecomStatus;
  public selectedItem: any;
  public selectedAgent: any;
  public mineTask = false;
  public currentUser: any;
  public isAdmin: boolean = false;
  public mnos: any = []

  public searchForm: any = {
    keysearch: '',
    action: '',
    status: '',
    mine: '',
    page: 1,
    array_status: [],
    skip: 0,
    take: 20,
    date_range: '',
    telco: '',
    channel_id: '',
    batch_id: '',
  }
  dateRange: any;

  ranges: any = {
    'Hôm nay': [dayjs(), dayjs()],
    'Hôm qua': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Tuần vừa qua': [dayjs().subtract(6, 'days'), dayjs()],
    'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Tháng trước': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }

  public modalRef: any;

  @BlockUI('item-block') itemBlockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private activeRouted: ActivatedRoute,
    private adminService: AdminService,
    private gtalkService: GtalkService,
    private authenticaionService: AuthenticationService,
    private alertService: SweetAlertService,
    private inventoryService: InventoryService,

  ) {
    this.dateRange = null;
    this.activeRouted.queryParams.subscribe(params => {
      this.taskTelecomStatus = Object.keys(ProductStatus).filter(p => !Number.isInteger(parseInt(p))).reduce((obj, key) => {
        obj[key] = ProductStatus[key];
        return obj;
      }, {});

      this.searchForm.keysearch = params['keysearch'] && params['keysearch'] != undefined ? params['keysearch'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.action = params['action'] && params['action'] != undefined ? params['action'] : '';
      this.searchForm.channel_id = params['channel_id'] && params['channel_id'] != undefined ? params['channel_id'] : '';
      this.searchForm.batch_id = params['batch_id'] && params['batch_id'] != undefined ? params['batch_id'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;
      this.searchForm.date_range = params['date_range'] && params['date_range'] != undefined ? params['date_range'] : '';
      
      this.contentHeader.headerTitle = 'Danh sách số';
      this.contentHeader.breadcrumb.links[1] = 'Danh sách số';

      this.getData();
    })

  }

  async modalOpen(modal, item = null) {
    this.itemBlockUI.start();
    this.selectedItem = item;

    this.itemBlockUI.stop();
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'xl',
      backdrop: 'static',
      keyboard: false
    });
  }

  modalClose() {
    this.selectedItem = null;
    this.getData();
    this.modalRef.close();
  }
  async modalViewAgentOpen(modal, item = null) {
    if (item) {
      this.itemBlockUI.start();

      try {
        let res = await this.gtalkService.taskViewAgent(item);
        if (!res.status) {
          this.getData();
          this.alertService.showMess(res.message);
        }
        this.selectedAgent = res.data;
        this.itemBlockUI.stop();
        this.modalRef = this.modalService.open(modal, {
          centered: true,
          windowClass: 'modal modal-primary',
          size: 'sm',
          backdrop: 'static',
          keyboard: false
        });
      } catch (error) {
        this.itemBlockUI.stop();
        return;
      }

    }
  }

  modalViewAgentClose() {
    this.selectedAgent = null;
    this.getData();
    this.modalRef.close();
  }


  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/inventory/list-batch'], { queryParams: this.searchForm });
  }

  viewDetailSummary(array_status, action) {
    this.searchForm.action = action;
    this.searchForm.array_status = array_status;
    this.router.navigate(['/inventory/list-batch'], { queryParams: this.searchForm });
  }

  initActiveBoxSummary() {
    this.isActivedBoxChangeSimInit = false;
    this.isActivedBoxChangeSimProcessing = false;
    this.isActivedBoxNewInit = false;
    this.isActivedBoxNewProcessing = false;
    this.isActivedBoxUpdateInit = false;
    this.isActivedBoxUpdateProcessing = false;
  }

  setActiveBoxSummary(array_status, action) {
    if (action == this.listTaskAction.new_sim.value) {
      if (JSON.stringify(array_status) == JSON.stringify([this.taskTelecomStatus.STATUS_NEW_ORDER + ""])) {
        this.isActivedBoxNewInit = true;
      }
      if (JSON.stringify(array_status) == JSON.stringify([this.taskTelecomStatus.STATUS_PROCESSING + "", "" + this.taskTelecomStatus.STATUS_PROCESS_TO_MNO])) {
        this.isActivedBoxNewProcessing = true;
      }
    } else if (action == this.listTaskAction.change_info.value) {
      if (JSON.stringify(array_status) == JSON.stringify([this.taskTelecomStatus.STATUS_NEW_ORDER + ""])) {
        this.isActivedBoxChangeSimInit = true;
      }
      if (JSON.stringify(array_status) == JSON.stringify([this.taskTelecomStatus.STATUS_PROCESSING + "", "" + this.taskTelecomStatus.STATUS_PROCESS_TO_MNO])) {
        this.isActivedBoxChangeSimProcessing = true;
      }
    }
  }

  showDate(date, timeZone, diff) {
    if (!date) {
      return '';
    }
    let dateConverted = new Date(date);
    dateConverted.setMinutes(new Date(date).getMinutes() + diff);
    return formatDate(dateConverted, 'dd/MM/yyyy H:mm', 'en-US', timeZone);
  }

  onSubmitSearch() {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate
      ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) : '';
    this.searchForm.date_range = daterangeString;
    this.searchForm.mine = this.mineTask ? 1 : '';
    this.router.navigate(['/inventory/list-batch'], { queryParams: this.searchForm });
  }

  onSubmitExportExcelReport() {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate
      ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) : '';
    this.searchForm.date_range = daterangeString;
    this.gtalkService.exportExcelReport(this.searchForm).subscribe(res => {
      var newBlob = new Blob([res.body], { type: res.body.type });
      let url = window.URL.createObjectURL(newBlob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = "Báo cáo đấu nối";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    })
  }
  onUpdateStatusSuccess(eventData: { updated: boolean }) {
    if (eventData.updated) {
      this.getData();
      // this.modalRef.close();
    }
  }

  ngOnInit(): void {
  }


  getData() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.sectionBlockUI.start();
    this.searchForm.skip = (this.searchForm.page - 1) * this.searchForm.take;
    this.inventoryService.getAllSim(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      this.totalItems = res.data.count;
    });

  }

}
