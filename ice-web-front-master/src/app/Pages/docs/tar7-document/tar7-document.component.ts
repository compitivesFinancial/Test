import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CampaginWithKyc } from 'src/app/Shared/Models/campagin-with-kyc';
import { CampaignService } from 'src/app/Shared/Services/campaign.service';
import { DocumentService } from 'src/app/Shared/Services/document.service';
import { environment } from 'src/environments/environment';
import { DashboardService } from '../../Dashboard/dashboard.service';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';

@Component({
  selector: 'app-tar7-document',
  templateUrl: './tar7-document.component.html',
  styleUrls: ['./tar7-document.component.css'],
})
export class Tar7DocumentComponent implements OnInit {
  LANG = environment.english_translations;
  campaginWithKyc!: CampaginWithKyc;
  kycStatus: any;
  subscriptions: Subscription[] = [];
  user_data: any = {};
  selectedOpportunity: any;
  requestId: any;

  constructor(
    private route: ActivatedRoute,
    private campaignService: CampaignService,
    private documentService: DocumentService,
    public dashboardService: DashboardService,public decryptAES:decryptAesService
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
          this.campaginWithKyc = res.response;
        }
      });
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
    if (
      localStorage.getItem('arabic') == 'true' &&
      localStorage.getItem('arabic') != null
    ) {
      this.LANG = environment.arabic_translations;
    } else {
      this.LANG = environment.english_translations;
    }
  }
}
