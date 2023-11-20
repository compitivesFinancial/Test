import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import { Subscription } from 'rxjs';
import { CampaginWithKyc } from 'src/app/Shared/Models/campagin-with-kyc';
import { CampaignService } from 'src/app/Shared/Services/campaign.service';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';
import { DocumentService } from 'src/app/Shared/Services/document.service';
import { StatementsService } from 'src/app/Shared/Services/statements.service';
import { environment } from 'src/environments/environment.prod';
import { DashboardService } from '../../Dashboard/dashboard.service';
import { SharedService } from 'src/app/Shared/Services/shared.service';

@Component({
  selector: 'app-investmentagreement',
  templateUrl: './investmentagreement.component.html',
  styleUrls: ['./investmentagreement.component.css'],
})
export class InvestmentagreementComponent implements OnInit {
  @ViewChild('navContent',{static:false}) navContent!:ElementRef;
  public pageDetail: any = {}; 
  subscriptions: Subscription[] = [];
  LANG:any = {};
  session_user: any = {};
  investorAddress: any;
  myDate: any;
  pagePrint:any;
  selectedOpportunity: any;
  requestId: any;
  
  campaginWithKyc!: CampaginWithKyc;
  kycStatus: any;
  nationalId: any;
  username:any;
  /*****************************************************************/
  constructor(
    private datePipe: DatePipe,
    private campaign_service: CampaignService,
    private statement: StatementsService,public decryptAES:decryptAesService,
    private documentService: DocumentService, private route: ActivatedRoute,
    public dashboardService: DashboardService, private shared: SharedService
  ) {
    this.myDate = new Date();
    this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    const user_data = btoa(btoa('user_info_web'));
    if (localStorage.getItem(user_data) != undefined) {
      this.session_user = JSON.parse(
        atob(atob(localStorage.getItem(user_data) || '{}'))
      );
    }
    /*****************************************************************/
    this.statement.getPageDetails('2', '').subscribe((data: any) => {
      if (data.status) {
        this.pageDetail = data.response;
      }
    });
    this.campaign_service.getUserKycAddress().subscribe((data: any) => {
      if (data.status) {
        this.investorAddress = data.response;
      }
    });
    this.changeLanguage();
  }
  /*****************************************************************/
 
  /*****************************************************************/
  ngOnInit(): void {
    this.requestId = atob(this.route.snapshot.params['id']);
    this.getOpertunityDetails();
  }
  /***********************************************************************************/
  getSukukDetails() {
    
    this.documentService
      .getSukukDetails(
        this.selectedOpportunity.user_id,
        this.selectedOpportunity.id
      )
      .subscribe((res: any) => {
        this.kycStatus = res.status;
        if (res.status) {
          this.campaginWithKyc = res.response;
      
          
        }
      });
      this.campaign_service.getUserKycList().subscribe((res: any) => {
        this.nationalId=res.response[2].info_type[1].detail.filter((obj:any)=>obj&&obj.id===135)[0].value;
        localStorage.setItem("REALNAME",res.response[2].info_type[1].detail.filter((obj:any)=>obj&&obj.id===137)[0].value);
        if(localStorage.getItem("REALNAME")!==null)
        this.username=localStorage.getItem("REALNAME");
      else
      this.username=res.response[2].info_type[1].detail.filter((obj:any)=>obj&&obj.id===137)[0].value;
      })
  }
  /***********************************************************************************/
  changeLanguage() {
    this.shared.getLang().subscribe(lang => {
      if(lang=='ar'){
        this.LANG = environment.arabic_translations;
      }
      else {
        this.LANG = environment.english_translations;
        
      }
    });
  }
  getOpertunityDetails() {
    this.dashboardService
      .opertunityDetails(this.requestId)
      .subscribe((res: any) => {
        this.selectedOpportunity = res.response.campaign;
        this.getSukukDetails();
      });
  }
}
