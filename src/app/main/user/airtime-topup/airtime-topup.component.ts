import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from 'app/auth/service/task.service';
import { TelecomService } from 'app/auth/service/telecom.service';
import { ObjectLocalStorage, STORAGE_KEY } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-airtime-topup',
  templateUrl: './airtime-topup.component.html',
  styleUrls: ['./airtime-topup.component.scss']
})
export class AirtimeTopupComponent implements OnInit {

  public contentHeader: any;
  public list: any;
  public totalItems: number;
  public page: any;
  public total: any;
  public pageSize: any;
  public listCurrentAction: any;
  public listCurrentRoles: any;
  public listFiles: any;
  public searchForm = {
    user: '',
    title: '',
    status: '',
    daterange: '',
    trans_id: '',
    is_customer_sign: '',
    is_guarantee_sign: '',
    is_bank_sign: '',
    page: 1,
    service_code: '',
    page_size: 20
  }
  
  public task;
  public trans;
  public wh;

  public modalRef: any;

  constructor(
    private readonly alertService: SweetAlertService,
    private readonly taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
  ) { 
    this.route.queryParams.subscribe(params => {
      this.searchForm.user = params['user'] && params['user'] != undefined ? params['user'] : '';
      this.searchForm.title = params['title'] && params['title'] != undefined ? params['title'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.service_code = params['service_code'] && params['service_code'] != undefined ? params['service_code'] : '';
      this.searchForm.trans_id = params['trans_id'] && params['trans_id'] != undefined ? params['trans_id'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;
      this.searchForm.is_customer_sign = params['is_customer_sign'] && params['is_customer_sign'] != undefined ? params['is_customer_sign'] : '';
      this.searchForm.is_guarantee_sign = params['is_guarantee_sign'] && params['is_guarantee_sign'] != undefined ? params['is_guarantee_sign'] : '';
      this.searchForm.is_bank_sign = params['is_bank_sign'] && params['is_bank_sign'] != undefined ? params['is_bank_sign'] : '';

      this.route.data.subscribe(data => {
        console.log(data);
      });
      this.getData();
    })
  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_USER));
    this.listCurrentAction = user.actions;
    this.listCurrentRoles = user.roles;
    this.contentHeader = {
      headerTitle: 'Danh sách đơn airtime',
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
            name: 'Danh sách đơn airtime',
            isLink: false
          }
        ]
      }
    };    
  }

  checkAction(action) {
    return this.listCurrentRoles.find(item => item.item_name.includes(action))
  }

  onSubmitSearch(): void {
    this.router.navigate(['/user/airtime'], { queryParams: this.searchForm})
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/user/airtime'], { queryParams: this.searchForm})
  }

  async onUpdateStatus(item, status) {
    let data = {
      id: item.id,
      status: status,
      note: ''
    }
    if (status == 0 || (status == 10 && this.checkAction("ACCOUNTING"))) {
      let titleS;
      if (status == 0) {
        titleS = 'Từ chối yêu cầu, gửi lý do cho đại lý'
      }

      Swal.fire({
        title: titleS,
        input: 'textarea',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Gửi',
        showLoaderOnConfirm: true,
        preConfirm: (note) => {
          if (!note || note == '') {
            Swal.showValidationMessage(
              "Vui lòng nhập nội dung"
            )
            return;
          }
          data.note = note;
          this.taskService.departmentUpdateTaskStatus(data).subscribe(res => {
            if (!res.status) {
              Swal.showValidationMessage(
                res.message
              )
              // this.alertService.showError(res.message);
              return;
            }
          }, error => {
            Swal.showValidationMessage(
              error
            )
          });

        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          this.getData();
          //this.updateStatus.emit({updated: true});
          this.alertService.showSuccess('Thành công');
        }
      })
    } else {
      let confirmMessage = "";
      if (status == 20) {
        confirmMessage = 'Xác nhận duyệt yêu cầu';
        data.note = "Xác nhận"
      } else if (status == 1) {
        confirmMessage = 'Xác nhận đã nhận được tiền';
      }

      if ((await this.alertService.showConfirm(confirmMessage)).value) {
        this.taskService.departmentUpdateTaskStatus(data).subscribe(res => {
          if (!res.status) {
            this.alertService.showMess(res.message);
            return;
          }
          this.getData();
          this.alertService.showSuccess(res.message);
        }, error => {
          this.alertService.showMess(error);
          return;
        })

      }
    }

  }

  onViewAttachments() {
    
  }

  getData(): void {
    this.taskService.getAllAirTime(this.searchForm).subscribe(res => {
      this.list = res.data.items;
      this.totalItems = res.data.count;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })
  }

}
