import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Console } from 'console';
import { Subscription } from 'rxjs';
import { CampaginWithKyc } from 'src/app/Shared/Models/campagin-with-kyc';
import { CampaignService } from 'src/app/Shared/Services/campaign.service';
import { environment } from 'src/environments/environment.prod';
import { DashboardService } from '../../Dashboard/dashboard.service';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';
import { SharedService } from 'src/app/Shared/Services/shared.service';

@Component({
  selector: 'app-program-info',
  templateUrl: './program-info.component.html',
  styleUrls: ['./program-info.component.css']
})
export class ProgramInfoComponent implements OnInit {
  user_data: any = {};
  selectedOpportunity:any;
  LANG = environment.arabic_translations;
  campaginWithKyc!: CampaginWithKyc;
  kycStatus: any;
  subscriptions: Subscription[] = [];
  requestId: any;
  loading: boolean=true;
  constructor(private route: ActivatedRoute,private dashboardService: DashboardService,public decryptAES:decryptAesService, private shared: SharedService) {
    this.changeLanguage();
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
        if(!!res){
          this.selectedOpportunity = res.response.campaign;
          this.dashboardService.programInfoInvestor(this.selectedOpportunity.id).subscribe((investorInfo:any)=>{
            if(investorInfo){
              this.dashboardService.programInfo(this.selectedOpportunity.id).subscribe((opportunityInfo:any)=>{
                if(opportunityInfo){
                  this.loading=false;
                  console.log("investorInfo",investorInfo);
                  console.log("opportunityInfo",opportunityInfo);
                }
              });
            }
           
          })
          
        }
        
        console.log("selectedOpportunity",this.selectedOpportunity);
      });
  }
}
