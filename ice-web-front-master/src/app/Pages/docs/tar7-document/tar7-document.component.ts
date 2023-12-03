import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CampaginWithKyc } from 'src/app/Shared/Models/campagin-with-kyc';
import { CampaignService } from 'src/app/Shared/Services/campaign.service';
import { DocumentService } from 'src/app/Shared/Services/document.service';
import { environment } from 'src/environments/environment.prod';
import { DashboardService } from '../../Dashboard/dashboard.service';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';
import { SharedService } from 'src/app/Shared/Services/shared.service';

@Component({
  selector: 'app-tar7-document',
  templateUrl: './tar7-document.component.html',
  styleUrls: ['./tar7-document.component.css'],
})
export class Tar7DocumentComponent implements OnInit {
  LANG = environment.arabic_translations;
  campaginWithKyc!: CampaginWithKyc;
  kycStatus: any;
  subscriptions: Subscription[] = [];
  user_data: any = {};
  selectedOpportunity: any;
  requestId: any;
companyName:any;
  crEntityNumber: any;
  commercialNumber: any;
  loading:boolean=true;
  constructor(
    private route: ActivatedRoute,
    private campaignService: CampaignService,
    private documentService: DocumentService,
    public dashboardService: DashboardService,public decryptAES:decryptAesService, private shared: SharedService
  ) {
    const user_data = btoa(btoa('user_info_web'));
    if (localStorage.getItem(user_data) != undefined) {
      this.user_data = JSON.parse(
        atob(atob(localStorage.getItem(user_data) || '{}'))
      );
    }
  
  }

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
          this.companyName=res.response.filter((obj:any)=>obj.company_name)[0].company_name;
          this.campaginWithKyc = res.response.filter((obj:any)=>obj.id)[0];
          this.crEntityNumber=res.response.filter((obj:any)=>obj.crEntityNumber)[0].crEntityNumber; 
        this.loading=false;
        }
      });


      // this.campaign_service.getUserKycList().subscribe((res: any) => {
      //   this.nationalId=res.response[2].info_type[1].detail.filter((obj:any)=>obj&&obj.id===135)[0].value; 
      //   localStorage.setItem("REALNAME",res.response[2].info_type[1].detail.filter((obj:any)=>obj&&obj.id===137)[0].value);
      //   if(localStorage.getItem("REALNAME")!==null)
      //   this.username=localStorage.getItem("REALNAME");
      // else
      // this.username=res.response[2].info_type[1].detail.filter((obj:any)=>obj&&obj.id===137)[0].value;
      // })
  }
  /***********************************************************************************/

  getOpertunityDetails() {
    this.dashboardService
      .opertunityDetails(this.requestId)
      .subscribe((res: any) => {
        this.selectedOpportunity = res.response.campaign;
        this.getSukukDetails();
      });
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
}
