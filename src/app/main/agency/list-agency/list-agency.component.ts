import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'app/auth/service';
import { TaskService } from 'app/auth/service/task.service';
import { CommonService } from 'app/utils/common.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-list-agency',
  templateUrl: './list-agency.component.html',
  styleUrls: ['./list-agency.component.scss']
})
export class ListAgencyComponent implements OnInit {
  public modalRef: any;
  public contentHeader: any;
  public list: any;
  public totalPage: number;
  public page: number = 1;
  public pageSize: number;
  public searchForm = {
    keyword: '',
    status: '',
    page: 1,
  }
  public selectedUser: any;
  public listServices: any;
  public listBalances: any;

  public price;
  public discount;

  public dataCreatePayment = {
    amount: 0,
    service_code: "AIRTIME_TOPUP",
    bill_id: "0356342770",
    payment_method: "BANK_TRANSFER",
    desc: '',
    file: ''
  };

  public dataCreateMerchant = {
    services: ['AIRTIME_TOPUP'],
    username: '',
    mobile: '',
    password: '',
    email: ''
  }

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  @BlockUI('item-block') itemBlockUI: NgBlockUI;

  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private alertService: SweetAlertService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
  ) { 
    this.route.queryParams.subscribe(params => {
      this.searchForm.keyword = params['keyword'] && params['keyword'] != undefined ? params['keyword'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : '';

      this.getData();
    })
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Danh sách merchant',
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
            name: 'Danh sách merchant',
            isLink: false
          }
        ]
      }
    };    
  }

  onSubmitSearch(): void {
    this.router.navigate(['/merchant/list'], { queryParams: {keyword: this.searchForm.keyword, status: this.searchForm.status}})
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/merchant/list'], { queryParams: this.searchForm})
  }

  async onSubmitLock(id, status){
    const confirmMessage = status ? "Bạn có đồng ý mở khóa user?" : "Bạn có đồng ý khóa user?";
    if((await this.alertService.showConfirm(confirmMessage)).value) {
      this.userService.lockUser(id, status, "").subscribe(res => {
        if(!res.status) {
          this.alertService.showError(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
        this.getData();
      }, err => {
        this.alertService.showError(err);
      })
    }
  }

  async onCreateTask() {
    if ((await this.alertService.showConfirm("Bạn có đồng ý tạo yêu cầu nạp airtime?")).value) {
      this.itemBlockUI.start();
      this.dataCreatePayment.bill_id = this.selectedUser.mobile;
      this.taskService.createTask(this.selectedUser.id, this.dataCreatePayment).subscribe(res => {
        this.itemBlockUI.stop();
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
        this.modalClose();
        this.getData();
      }, error => {
        this.itemBlockUI.stop();
        this.alertService.showMess(error);
        return;
      })
    }
  }

  async onCreateMerchant() {
    if ((await this.alertService.showConfirm("Bạn có đồng ý tạo tài khoản đại lý?")).value) {
      this.itemBlockUI.start();
      this.userService.createMerchant(this.dataCreateMerchant).subscribe(res => {
        this.itemBlockUI.stop();
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.dataCreateMerchant = {
          services: ['AIRTIME_TOPUP'],
          username: '',
          mobile: '',
          password: '',
          email: ''
        }
        this.alertService.showSuccess(res.message);
        this.modalClose();
        this.getData();
      }, error => {
        this.itemBlockUI.stop();
        this.alertService.showMess(error);
        return;
      })
    }
  }

  onViewBalance() {
    this.alertService.showMess("Tính năng đang phát triển");
    return;
  }

  modalBalanceOpen(modal, item) {
    this.userService.getMerchantBalances(item.id).subscribe(res => {
      if(!res.status) {
        this.alertService.showMess(res.message);
        return;
      }
      this.listBalances = res.data;

      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });
    })
  }

  modalClose() {
    this.dataCreatePayment = {
      amount: 0,
      service_code: "AIRTIME_TOPUP",
      bill_id: "0356342770",
      payment_method: "BANK_TRANSFER",
      desc: '',
      file: ''
    };
    this.modalRef.close();;
  }

  onCompletedInputPassword(value) {
    this.dataCreateMerchant.password = value;
    // this.formGroup.patchValue({
    //   password: value
    // })
  }

  onInputAmount(event) {
  
    this.taskService.calculatePriceDiscount({ service_code: this.dataCreatePayment.service_code, amount: this.dataCreatePayment.amount }).subscribe(res => {
      this.price = res.data.amount
      this.discount = res.data.discount      
    })
  }

  async onSelectFileFront(event) {
    if (event.target.files && event.target.files[0]) {
      const image = await this.commonService.resizeImage(event.target.files[0]) + '';
      this.dataCreatePayment.file = image.replace('data:image/png;base64,', '')
    }
  }

  getData(): void {
    this.sectionBlockUI.start();
    this.userService.getAllMerchant(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      this.totalPage = res.data.count;
      this.pageSize = res.data.pageSize;
    }, error => {
      this.sectionBlockUI.stop();
      console.log("ERRRR");
      console.log(error);
    })
  }
}
