import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'app/auth/service';
import { InventoryService } from 'app/auth/service/inventory.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { TelecomService } from 'app/auth/service/telecom.service';
import { CommonDataService } from 'app/auth/service/common-data.service';
import { id } from '@swimlane/ngx-datatable';
import { CommonService } from 'app/utils/common.service';
import { TaskService } from 'app/auth/service/task.service';
import { GtalkService } from 'app/auth/service/gtalk.service';
import { CollaboratorService } from 'app/auth/service/collaborator.service';

@Component({
  selector: 'app-edit-sell-chanel',
  templateUrl: './edit-sell-chanel.component.html',
  styleUrls: ['./edit-sell-chanel.component.scss'],
  encapsulation: ViewEncapsulation.None

})


export class EditSellChanelComponent implements OnInit {
  onClearHomeProvince() {
    throw new Error('Method not implemented.');
  }
  onClearHomeDistrict() {
    throw new Error('Method not implemented.');
  }

  @ViewChild('modalAttachments') modalAttachments;


  public modalRef: any;
  @Input() provinces;
  @Input() districts;
  @Input() commues;

  public submittedUpload: boolean = false;
  public currentUser: any;
  public isAdmin: boolean = false;
  public listMyChanel: any;

  public formGroup;
  public isCreate: boolean = false;
  public submitted: boolean = false;


  public searchForm = {
    keyword: '',
    status: '',
    nameSell: '',
    nameChanel: '',
    codeSell: '',
    page: 1
  }

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  count: any;
  public contentHeader: any;
  public list: any;
  public listCustomer: any;
  public listAdmin: any;
  public listSellUser: any;
  public titleModal: string;
  public selectedItem: number;

  public listEdit: any;

  public totalPage: number;
  public page: number = 1;
  public pageSize: number;
  id;
  listFiles = [];
  fileExt;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private inventoryService: InventoryService,
    private alertService: SweetAlertService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private telecomService: TelecomService,
    private commonDataService: CommonDataService,
    private commonService: CommonService,
    private taskService: TaskService,
    private gtalkService: GtalkService,
    private fb: FormBuilder,
    private collaboratorSerivce: CollaboratorService,


  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getData();
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Sửa kho',
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
            name: 'Sửa kho',
            isLink: false
          }
        ]
      }
    };

    this.initForm();
  }

  async listUser() {
    this.taskService.getListCustomer(this.formGroup).subscribe(res => {
      this.listCustomer = res.data.items;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })

    this.taskService.getListAdmin(this.searchForm).subscribe(res => {
      this.listAdmin = res.data.items;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })

    this.userService.getAll(this.formGroup).subscribe(res => {
      this.sectionBlockUI.stop();
      this.listSellUser = res.data.items;
    }, error => {
      this.sectionBlockUI.stop();
      console.log("ERRRR");
      console.log(error);
    })
  }


  async onFileChangeAttach(event) {
    if (event.target.files && event.target.files[0]) {
      const ext = event.target.files[0].type;
      if(ext.includes('jpg') || ext.includes('png') || ext.includes('jpeg')) {
        this.formGroup.attached_file_name = event.target.files[0].name;
        let img = await this.commonService.resizeImage(event.target.files[0]);
        this.formGroup.attached_file_content = (img + '').replace('data:image/png;base64,', '')
      } else if (ext.includes('pdf')) {
        this.formGroup.attached_file_name = event.target.files[0].name;
        this.formGroup.attached_file_content = (await this.commonService.fileUploadToBase64(event.target.files[0])+'').replace('data:application/pdf;base64,', '');
      }
    }
  }


  async onChangeHomeProvince(id, init = null) {

    try {
      const res = await this.commonDataService.getDistricts(id).toPromise();
      if (res.status == 1) {
        if (!init) {
          this.formGroup.controls['district_id'].setValue('');
          this.formGroup.controls['commune_id'].setValue('');

        }
        this.districts = res.data;
        // this.commues = []
      }
    } catch (error) {

    }
  }

  async onChangeHomeDistrict(id, init = null) {

    try {
      const res = await this.commonDataService.getCommunes(id).toPromise();
      if (res.status == 1) {
        if (!init) {
          this.formGroup.controls['commune_id'].setValue('');
        }
        this.commues = res.data
      }
    } catch (error) {

    }
  }

  onViewAttachments() {
    let files = this.formGroup.attached_file_name ? JSON.parse(this.formGroup.attached_file_name) : null;
    if(files && files.file) {
      this.inventoryService.viewFile({
        file: files.file
      }).subscribe(res => {
        if(!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.listFiles = [
          {ext: res.data.ext, base64: res.data.base64}
        ];
        this.onViewModalApprove(this.modalAttachments);
      },error => {
        this.alertService.showMess(error);
      })
    } else {
      this.onViewModalApprove(this.modalAttachments);
    }    
    
  }

  onViewModalApprove(modal) {
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'lg'
    });
  }


  initForm() {

    this.formGroup = this.fb.group({
      id: ['', Validators.required],
      sell_channelid: ['', Validators.required],
      quantity: ['', Validators.required],
      parent_id: ['', Validators.required],
      name: ['', Validators.required],
      code: ['', Validators.required],
      desc: ['', Validators.required],
      type: ['', Validators.required],
      status: ['', Validators.required],
      level: ['', Validators.required],
      business_id: ['', Validators.required],
      admin_id: ['', Validators.required],
      province_id: ['', Validators.required],
      district_id: ['', Validators.required],
      commune_id: ['', Validators.required],
      address: ['', Validators.required],
      isFileChanged: ['', Validators.required],
      attached_file_name: ['', Validators.required],
      attached_file_content: ['', Validators.required],
      customer_id: ['', Validators.required],
    })
  }



  getData() {

    this.commonDataService.getProvinces().subscribe((res: any) => {
      if (res.status == 1) {
        this.provinces = res.data
      }
    })

    this.fileExt = 'pdf';
    // let files = this.formGroup.attached_file_content ? JSON.parse(this.formGroup.attached_file_content) : null;
    // if (files && files.file) {
    //   const arrayFileExt = files.file.split('.');
    //   this.fileExt = arrayFileExt[arrayFileExt.length - 1];
    // } else {
    //   this.fileExt = '';
    // }

    this.inventoryService.getMyChannel(this.formGroup).subscribe(res => {
      this.listMyChanel = res.data.items;
      this.formGroup.parent_id = res.data.parent_id
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })

    console.log(this.id);
    this.inventoryService.viewDetailSell(this.id).subscribe(res => {
      this.submittedUpload = false;
      if (!res.status) {
        this.alertService.showError(res.message);
        return;
      }
      if (res.data.items[0] && res.data.items[0].province_id) {
        this.onChangeHomeProvince(parseInt(res.data.items[0].province_id), true);
      }
      if (res.data.items[0] && res.data.items[0].district_id) {
        this.onChangeHomeDistrict(parseInt(res.data.items[0].district_id), true);
      }

      this.formGroup.patchValue({
        id: res.data.items[0].id,
        name: res.data.items[0].name,
        code: res.data.items[0].code,
        desc: res.data.items[0].desc,
        parent_id: res.data.items[0].parent_id,
        quantity: res.data.items[0].quantity,
        admin_id: res.data.items[0].admin_id,
        attached_file_content: res.data.items[0].attached_file_content,
        attached_file_name: res.data.items[0].attached_file_name,
        business_id: res.data.items[0].business_id,
        customer_id: res.data.items[0].customer_id,
        isFileChanged: res.data.items[0].isFileChanged,
        level: res.data.items[0].level,
        status: res.data.items[0].status,
        type: res.data.items[0].type,
        province_id: res.data.items[0] && res.data.items[0].province_id ? parseInt(res.data.items[0].province_id) : '',
        district_id: res.data.items[0] && res.data.items[0].district_id ? parseInt(res.data.items[0].district_id) : '',
        commune_id: res.data.items[0] && res.data.items[0].commune_id ? parseInt(res.data.items[0].commune_id) : '',
        address: res.data.items[0].address,

      })

      this.listEdit = res.data.items;
      this.listUser()


    }, error => {
      this.submittedUpload = false;
      this.alertService.showError(error);
    })


  }

  get f() {
    return this.formGroup.controls;
  }

  async onSubmitCreate() {
    this.submitted = true;
    // if (this.formGroup.invalid) {
    //   console.log('validate')
    //   return;
    // }
    let dataPost = {
      id: this.formGroup.controls['id'].value,
      sell_channelid: this.formGroup.controls['sell_channelid'].value,
      parent_id: this.formGroup.controls['parent_id'].value,
      name: this.formGroup.controls['name'].value,
      code: this.formGroup.controls['code'].value,
      desc: this.formGroup.controls['desc'].value,
      type: this.formGroup.controls['type'].value,
      quantity: this.formGroup.controls['quantity'].value,
      status: this.formGroup.controls['status'].value,
      level: this.formGroup.controls['level'].value,
      business_id: this.formGroup.controls['business_id'].value,
      admin_id: this.formGroup.controls['admin_id'].value,
      province_id: this.formGroup.controls['province_id'].value,
      district_id: this.formGroup.controls['district_id'].value,
      commune_id: this.formGroup.controls['commune_id'].value,
      address: this.formGroup.controls['address'].value,
      isFileChanged: this.formGroup.controls['isFileChanged'].value,
      attached_file_name: this.formGroup.controls['attached_file_name'].value,
      attached_file_content: this.formGroup.controls['attached_file_content'].value,
      customer_id: this.formGroup.controls['customer_id'].value,

    }
    if ((await this.alertService.showConfirm("Bạn có đồng ý sửa kho")).value) {
      this.submittedUpload = true;
      this.inventoryService.updateSellChanel(dataPost).subscribe(res => {
        this.submittedUpload = false;
        if (!res.status) {
          this.alertService.showError(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
        this.router.navigate(['/inventory/sell-chanel'])
      }, error => {
        this.submittedUpload = false;
        this.alertService.showError(error);
      })
    }


  }

}

