import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'app/auth/service';
import { InventoryService } from 'app/auth/service/inventory.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { TelecomService } from 'app/auth/service/telecom.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {

  public contentHeader: any;
  public list: any;
  public totalItems: number;
  public page: number = 1;
  public pageSize: number;
  public searchForm = {
    keyword: '',
    status: '',
    page_size: 15,
    page: 1
  }
  public selectedItem: any
  public isCreate: boolean = false;
  public submitted: boolean = false;
  public exitsUser: boolean = false;

  public submittedUpload: boolean = false;
  public filesData: any;
  public filesImages: any;
  public adminId: any;
  public refCode: any;

  public currentUser: any;
  public isAdmin: boolean = false;

  public modalRef: any;
  public titleModal: string;
  public formGroup: FormGroup;
  public subFormGroup: FormGroup;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  count: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private inventoryService: InventoryService,
    private alertService: SweetAlertService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private telecomService: TelecomService,


  ) {
    this.route.queryParams.subscribe(params => {
      this.searchForm.keyword = params['keyword'] && params['keyword'] != undefined ? params['keyword'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : '';

      this.getData();
    })
  }

  loadPage(page): void {
    this.searchForm.page = page;
    this.router.navigate(['/inventory/batch'], { queryParams: this.searchForm })
  }

  modalOpen(modal, item = null) {
    if (item) {
      this.titleModal = "Cập nhật kênh";
      this.isCreate = false;
      this.selectedItem = item;
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });

    } else {
      this.titleModal = "Thêm kênh";
      this.isCreate = true;
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });
    }
  }

  modalClose() {
    this.modalRef.close();
    this.initForm();
  }


  onSubmitSearch(): void {
    this.searchForm.page = 1;
    this.router.navigate(['/inventory/batch'], { queryParams: this.searchForm })
  }

  onFocusMobile() {
    this.exitsUser = false;
    this.titleModal = "Thêm đại lý";
  }

  async onSubmitCreate() {
    console.log("onSubmitCreate");
  }

  async onFileChangeExcel(event) {
    this.filesData = event.target.files[0];
  }

  async onFileChangeImages(event) {
    this.filesImages = event.target.files[0];
  }

  async onSubmitUpload() {
    if (!this.filesData || !this.filesImages || !this.adminId) {
      this.alertService.showError("Vui lòng nhập đủ dữ liệu");
    }
    if ((await this.alertService.showConfirm("Bạn có đồng ý tải lên dữ liệu của file excel")).value) {
      this.submittedUpload = true;
      const formData = new FormData();
      formData.append("files", this.filesData);
      formData.append("batch_id", this.selectedItem.id);

      console.log(this.filesData, this.selectedItem.id,formData)
    
      this.inventoryService.uploadFileBatch(formData).subscribe(res => {
        this.submittedUpload = false;
        if (!res.status) {
          this.alertService.showError(res.message);
          return;
        }
        this.filesData = null;
        this.filesImages = null;
        this.modalClose();
        this.alertService.showSuccess(res.message);
        this.getData();
      }, error => {
        this.submittedUpload = false;
        this.alertService.showError(error);
      })
    }
  }

  async onSelectFileAccount(event) {
    this.filesData = event.target.files[0];
  }

  async onSubmitUploadCCCD() {

    if ((await this.alertService.showConfirm("Bạn có đồng ý tải lên dữ liệu của file excel")).value) {
      this.submittedUpload = true;

      const formData = new FormData();
      formData.append("file", this.filesData);

      this.telecomService.assignNumberBatch(formData).subscribe(res => {
        this.submittedUpload = false;
        if (!res.status) {
          this.alertService.showError(res.message);
          return;
        }
        this.modalClose();
        this.alertService.showSuccess(res.message);
        this.getData();
      }, error => {
        this.submittedUpload = false;
        this.alertService.showError(error);
      })
    }
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Danh sách lô',
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
            name: 'Danh sách lô',
            isLink: false
          }
        ]
      }
    };

    this.initForm();
  }

  get f() {
    return this.formGroup.controls;
  }

  initForm() {
   
  }

  getData() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if (this.currentUser && this.currentUser.roles) {
      const arrayRoles = this.currentUser.roles.map(item => { return item.item_name.toLowerCase() });
      if (arrayRoles.includes("admin") || arrayRoles.includes("root")) {
        this.isAdmin = true;
      }
    }
    this.sectionBlockUI.start();
    this.inventoryService.findChannelAll(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      this.totalItems = res.data.count;
    }, error => {
      this.sectionBlockUI.stop();
      console.log("ERRRR");
      console.log(error);
    })
  }


}
