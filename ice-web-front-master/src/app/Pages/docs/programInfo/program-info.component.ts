import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Console } from 'console';
import { Subscription } from 'rxjs';
import { CampaginWithKyc } from 'src/app/Shared/Models/campagin-with-kyc';
import { CampaignService } from 'src/app/Shared/Services/campaign.service';
import { environment } from 'src/environments/environment';
import { DashboardService } from '../../Dashboard/dashboard.service';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';

@Component({
  selector: 'app-program-info',
  templateUrl: './program-info.component.html',
  styleUrls: ['./program-info.component.css']
})
export class ProgramInfoComponent implements OnInit {
  user_data: any = {};
  selectedOpportunity:any;
  LANG = environment.english_translations;
  campaginWithKyc!: CampaginWithKyc;
  kycStatus: any;
  subscriptions: Subscription[] = [];
  requestId: any;

  constructor(private route: ActivatedRoute,private dashboardService: DashboardService,public decryptAES:decryptAesService) {
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

  getOpertunityDetails() {
    this.dashboardService
      .opertunityDetails(this.requestId)
      .subscribe((res: any) => {
        this.selectedOpportunity = res.response.campaign;
      });
  }
}
