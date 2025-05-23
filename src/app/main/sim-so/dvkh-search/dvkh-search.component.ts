import { Component, OnInit } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { UserService } from 'app/auth/service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductStatus, STORAGE_KEY, TaskTelecom, TaskTelecomStatus } from 'app/utils/constants';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dvkh-search',
  templateUrl: './dvkh-search.component.html',
  styleUrls: ['./dvkh-search.component.scss']
})
export class DvkhSearchComponent implements OnInit {
  ProductStatus = ProductStatus;
  public total: any;
  public item: any;
  public showMessage: boolean
  public selectedItem: any;
  public taskTelecomStatus;
  public modalRef: any;
  productListAll: any;
  currChannel;

  public searchSim: any = {
    keysearch: '',
    category_id: 2,
    take: 10,
  }

  @BlockUI('section-block') itemBlockUI: NgBlockUI;

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
    // Trim the keysearch to remove leading and trailing whitespaces
    this.searchSim.keysearch = this.searchSim.keysearch.trim();
  
    // Optional: Add a validation check if the keysearch is empty
    if (!this.searchSim.keysearch) {
      this.alertService.showMess('Vui lòng nhập SĐT tìm kiếm');
      return;
    }
  
    console.log(this.searchSim);
    this.itemBlockUI.start();
    this.telecomService.getDetailSimDVKH(this.searchSim).subscribe(
      res => {
        this.itemBlockUI.stop();
        
        if (res.data && Object.keys(res.data).length > 0) {
          this.showMessage = false;
          this.item = res.data;
          console.log(this.item);
          this.total = res.data.count;
          this.getCurrChannel();
        } else {
          this.item = null;
          this.showMessage = true;
        }
      }, 
      err => {
        this.itemBlockUI.stop();
        this.alertService.showMess(err);
      }
    );
  }
  ngOnInit(): void {
    this.getData();
  }
  getData(): void {
  }

  async onSubmitLock(id, status, name) {

    let confirmMessage: string;

    if (status == 2) {
      confirmMessage = "Bạn có đồng ý mở khóa " + name + "?";
    } else {
      confirmMessage = "Bạn có đồng ý khóa " + name + "?";
    }

    // if ((await this.alertService.showConfirm(confirmMessage)).value) {
    //   this.userService.lockUser(id, status, "").subscribe(res => {
    //     if (!res.status) {
    //       this.alertService.showError(res.message);
    //       return;
    //     }
    //     this.alertService.showSuccess(res.message);
    //     this.getData();
    //   }, err => {
    //     this.alertService.showError(err);
    //   })
    // }
  }

  getCurrChannel() {
    for (const element of this.item?.sell_channels) {
      if (element.sub_channel_id == null) {
        this.currChannel = element;
      }
    }
  }

  getInvenstory() {
    return this.item?.sell_channels ? this.item.sell_channels.map(x => x.channel.name).join("-") : ""
  }

  async modalOpen(modal, item) {
    if (item) {
      this.selectedItem = item;
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg',
        backdrop: 'static',
        keyboard: false
      });

    }
  }

  async onNote() {

    Swal.fire({
      title: 'Khôi phục số',
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
        const data = {
          message: note,
          mobile: this.searchSim.keysearch
        }
        console.log(data);

        this.telecomService.noteRestore(data).subscribe(res => {
          if (!res.status) {
            Swal.showValidationMessage(
              res.message
            )
            this.onSubmitSearch();
            return;
          }
           this.onSubmitSearch();
          this.alertService.showSuccess(res.message);
        }, error => {
          this.alertService.showMess(error);

        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
      }
    })
  }

  modalClose() {
    this.selectedItem = null;
    this.getData();
    this.modalRef.close();
  }

}
