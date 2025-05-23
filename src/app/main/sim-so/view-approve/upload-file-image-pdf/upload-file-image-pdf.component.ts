import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TelecomService } from 'app/auth/service/telecom.service';
import { TaskTelecomStatus } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-upload-file-image-pdf',
  templateUrl: './upload-file-image-pdf.component.html',
  styleUrls: ['./upload-file-image-pdf.component.scss']
})
export class UploadFileImagePdfComponent implements OnInit {
  @Input() task_id: any;
  @Input() item: any;
  @Input() showTask: any;
  file = [];
  @ViewChild('modalViewFileTask') modalViewFileTask: ElementRef;
  fileTask;
  urls: any[] = [];
  itemFileTask;
  lengthFileTask = 0;
  multiples: any[] = [];
  @BlockUI('section-block') itemBlockUI: NgBlockUI;
  public modalRef: any;
  public taskTelecomStatus = TaskTelecomStatus;

  constructor(
    private cf: ChangeDetectorRef,
    private telecomService: TelecomService,
    private alertService: SweetAlertService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.getFileAttachedTask();
  }

  modalClose() {
    this.modalRef.close();
  }

  async modalOpenFileTask(modalViewFileTask, item = null) {
    if (item) {
      this.itemFileTask = item;
      this.modalRef = this.modalService.open(modalViewFileTask);
    }
  }

  deleteFileTask(item: any) {

    const data = {
      urls: [
        item.path
      ]
    }
    this.itemBlockUI.start();
    this.telecomService.patchDeleteFileTask(this.task_id, data).subscribe((res: any) => {

      if (res.status === 1) {
        this.getFileAttachedTask();
        this.alertService.showMess(res.data.messsage);
      }
      this.itemBlockUI.stop();
    }, err => {
      this.itemBlockUI.stop();
      this.alertService.showMess(err);
    })
  }

  getFileAttachedTask() {
    this.itemBlockUI.start();
    this.telecomService.getFileAttachedTask(this.task_id).subscribe((res: any) => {

      if (res.status === 1 && res.data?.items?.length > 0) {
        this.fileTask = res.data.items;
        for (const file of this.fileTask) {
          const file_name_replace = file.file_name.substring(file.file_name.indexOf('_') + 1);
          file.file_name = file_name_replace;
        }
        console.log(this.fileTask);

        this.lengthFileTask = res.data.items.length;
      }
      this.itemBlockUI.stop();
    }, err => {
      this.itemBlockUI.stop();
      this.alertService.showMess(err);
    })
  }

  onSelectFile(event) {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }
  
    let newFiles = [];
  
    for (const file of files) {
      const fileSizeMB = file.size / 1024 / 1024; // in MB
      const isVideo = file.type.includes('video');
  
      if (isVideo && fileSizeMB > 50) {
        this.alertService.showMess('Vui lòng tải lại video không quá 50MB!');
        return;
      } else if (!isVideo && fileSizeMB > 5) {
        this.alertService.showMess('Vui lòng tải lại file không quá 5MB!');
        return;
      }
  
      newFiles.push(file);
    }
  
    // Kiểm tra tổng số file sau khi thêm các file mới
    const totalFiles = this.multiples.length + this.lengthFileTask + newFiles.length;
    if (totalFiles > 10) {
      this.alertService.showMess('Tải lên tối đa 10 file!');
      return;
    }
  
    for (const file of newFiles) {
      this.file.push(file);
  
      const reader = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onload = (event) => {
        const url = (event.target as FileReader).result as string;
        let type = '';
        if (url.includes('video')) {
          type = 'video';
        } else if (url.includes('jpg') || url.includes('png') || url.includes('jpeg')) {
          type = 'img';
        } else if (url.includes('pdf')) {
          type = 'pdf';
        }
  
        this.multiples.push({ url, type });
        this.cf.detectChanges();
      };
    }
  
    this.cf.detectChanges();
  }

  upload() {
    const formData = new FormData();
    formData.append('task_id', this.task_id);
    this.file.forEach((file) => { formData.append('files', file); })
    this.itemBlockUI.start();
    this.telecomService.postUpdateAttachments(formData).subscribe((res: any) => {
      if (res.status === 1) {
        this.alertService.showMess(res.message);
        this.getFileAttachedTask();
        this.multiples = [];
        this.file = [];
      } else {
        this.alertService.showMess(res.message);
      };
      this.itemBlockUI.stop();
    }, err => {
      this.itemBlockUI.stop();
      this.alertService.showMess(err);
    })
  }
  
}
