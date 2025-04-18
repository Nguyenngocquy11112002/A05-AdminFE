import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SweetAlertService } from "app/utils/sweet-alert.service";
import { TelecomService } from "app/auth/service/telecom.service";

@Component({
  selector: "app-transfer-sovereignty",
  templateUrl: "./transfer-sovereignty.component.html",
  styleUrls: ["./transfer-sovereignty.component.scss"],
})
export class TransferSovereigntyComponent implements OnInit {
  searchSim = "";
  identificationNo = "";
  noneConfirm = false;
  public modalRef: any;
  selectBusinessOrIndividual;
  data;
  dataSplit;
  taskIdOld;
  selectConversionObject = [
    { name: "Cá nhân", id: 0, code: "individual" },
    { name: "Doanh nghiệp", id: 1, code: "business" },
  ];
  showNewSubscriberRegistration = false;

  @BlockUI("section-block") itemBlockUI: NgBlockUI;
  @ViewChild("modalItemNew") modalItemNew: ElementRef;
  @ViewChild("modalItemConversionObject") modalItemConversionObject: ElementRef;

  constructor(
    private modalService: NgbModal,
    private alertService: SweetAlertService,
    private telecomService: TelecomService
  ) {}

  ngOnInit(): void {}

  formatNumber(number: string): string {
    return number.replace(/[^\d]/g, "");
  }

  onInputChange(item: string) {
    if (item == "searchSim") {
      this.searchSim = this.formatNumber(this.searchSim);
    }
    if (item == "identificationNo") {
      this.identificationNo = this.formatNumber(this.identificationNo);
    }
  }

  done(){
    this.searchSim = "";
    this.identificationNo = "";
    this.noneConfirm = false;
    this.showNewSubscriberRegistration = false;
    this.modalClose();
  }

  onSubmitSearch() {
    if (!this.searchSim) {
      this.alertService.showMess("Vui lòng không để trống số điện thoại");
      return;
    }
    if (!this.identificationNo) {
      this.alertService.showMess("Vui lòng không để trống số CCCD");
      return;
    }
    const data = {
      mobile: this.searchSim,
      identification_no: this.identificationNo,
    };
    this.itemBlockUI.start();
    this.telecomService.getSearchSim(data).subscribe(
      (res: any) => {
        if (res.status == 1) {
          this.noneConfirm = true;
          this.data = res.data;
          this.taskIdOld = res.data.task_id;
          this.itemBlockUI.stop();
        } else {
          this.itemBlockUI.stop();
          this.alertService.showMess(res.message);
        }
      },
      (error) => {
        this.itemBlockUI.stop();
        this.alertService.showError(error);
      }
    );
  }

  submitConversionObject() {
    if (this.selectBusinessOrIndividual == null) {
      this.alertService.showMess("Vui lòng lựa chọn đối tượng chuyển đổi!");
      return;
    }
    this.showNewSubscriberRegistration = true;
    this.modalClose();
  }

  onSelectConversionObject(id) {
    this.selectBusinessOrIndividual = this.selectConversionObject[id];
  }

  showViewCheckInfoNew(event) {
    this.dataSplit = event;
    this.modalOpen(this.modalItemNew);
  }

  modalClose() {
    this.modalRef.close();
  }

  async modalOpenItemConversionObject(modal, item = null) {
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: "modal modal-primary",
      size: "l",
      backdrop: "static",
      keyboard: true,
    });
  }

  async modalOpen(modal, item = null) {
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: "modal modal-primary",
      size: "xl",
      backdrop: true,
      keyboard: true,
    });
  }
}
