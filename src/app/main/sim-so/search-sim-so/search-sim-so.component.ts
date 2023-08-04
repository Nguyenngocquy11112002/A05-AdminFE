import { Component, OnInit } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { UserService } from 'app/auth/service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { STORAGE_KEY, TaskTelecom, TaskTelecomStatus } from 'app/utils/constants';


@Component({
  selector: 'app-search-sim-so',
  templateUrl: './search-sim-so.component.html',
  styleUrls: ['./search-sim-so.component.scss']
})
export class SearchSimSoComponent implements OnInit {

  public total: any;
  public item: any;
  public showMessage: boolean
  public selectedItem: any;
  public taskTelecomStatus;
  public modalRef: any;
  productListAll: any;

  public searchSim: any = {
    keysearch: '',
    category_id: 2,
    take: 10,
  }

  @BlockUI('item-block') itemBlockUI: NgBlockUI;

  constructor(
    private telecomService: TelecomService,
    private alertService: SweetAlertService,
    private userService: UserService,
    private modalService: NgbModal,

  ) {

    this.taskTelecomStatus = Object.keys(TaskTelecomStatus).filter(p => !Number.isInteger(parseInt(p))).reduce((obj, key) => {
      obj[key] = TaskTelecomStatus[key];
      return obj;
    }, {});
  }
  onSubmitSearch() {
    console.log(this.searchSim);

    this.telecomService.getDetailSim(this.searchSim).subscribe(res => {
      if (res.data) {
        this.showMessage = false;
        this.item = res.data
        this.total = res.data.count;
      } else {
        this.item = null
        this.showMessage = true;
      }

    })
  }
  ngOnInit(): void {
    this.getData();
  }
  getData(): void {
  }

  async onSubmitLock(id, status) {
    const confirmMessage = status ? "Bạn có đồng ý mở khóa user?" : "Bạn có đồng ý khóa user?";
    if ((await this.alertService.showConfirm(confirmMessage)).value) {
      this.userService.lockUser(id, status, "").subscribe(res => {
        if (!res.status) {
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


  async modalOpen(modal, item) {
    if (item) {
      this.itemBlockUI.start();
      this.selectedItem = item;
      let check;
      if (item.status != 2) {
        try {
          check = await this.telecomService.checkAvailabledTask(item.id);
          if (!check.status) {
            this.getData();
            this.alertService.showMess(check.message);
            // if(!this.isAdmin) {                         
            //   return;
            // }           

          }
          this.itemBlockUI.stop();
          this.modalRef = this.modalService.open(modal, {
            centered: true,
            windowClass: 'modal modal-primary',
            size: 'lg',
            backdrop: 'static',
            keyboard: false
          });
        } catch (error) {
          this.itemBlockUI.stop();
          return;
        }
      } else {
        this.itemBlockUI.stop();
        this.modalRef = this.modalService.open(modal, {
          centered: true,
          windowClass: 'modal modal-primary',
          size: 'lg',
          backdrop: 'static',
          keyboard: false
        });
      }


    }
  }

  modalClose() {
    this.selectedItem = null;
    this.getData();
    this.modalRef.close();
  }

}