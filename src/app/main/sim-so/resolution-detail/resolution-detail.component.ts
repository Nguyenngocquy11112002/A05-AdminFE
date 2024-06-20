import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-resolution-detail',
  templateUrl: './resolution-detail.component.html',
  styleUrls: ['./resolution-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ResolutionDetailComponent implements OnInit {

  public currentUser: any;
  listCurrentAction: any;
  public list: any;
  public totalItems: number;
  public summaryTask: any;
  public data: any;
  msisdns_id: any;

  public searchForm: any = {
    mobile: '',
    action: '',
    status: '',
    mine: '',
    page: 1,
    array_status: [],
    page_size: 20,
    date_range: '',
    telco: '',
    customer_name: '',
    customer_type: '',
    sub_action: 'SIM_CAM_KET'
  }
  public contentHeader: any =  {
    headerTitle: 'Chi tiết thuê bao cam kết',
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
          name: 'Chi tiết thuê bao cam kết',
          isLink: false
        }
      ]
    }
  };

  constructor(    
    private telecomService: TelecomService,
    private route: ActivatedRoute,
    private router: Router,

  ) { 
   
    this.route.queryParams.subscribe(params => {
      this.msisdns_id = params['msisdns_id'] && params['msisdns_id'] != undefined ? params['msisdns_id'] : '';
      this.getData();
    })
  }

  ngOnInit(): void {

  }

  getData() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.listCurrentAction = this.currentUser.actions;
    if(this.currentUser && this.currentUser.roles) {
    }
    this.telecomService.getDetailTask(this.msisdns_id).subscribe(res => {
      this.data = res.data;
    
    })
    this.telecomService.getSummary().subscribe(res => {
      this.summaryTask = res.data;
    })
  }

}
