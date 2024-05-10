import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { CampaignService } from 'src/app/Shared/Services/campaign.service';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { StatementsService } from 'src/app/Shared/Services/statements.service';
import { environment } from 'src/environments/environment.prod';
import { SettingService } from '../../setting/setting.service';

@Component({
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.css'],
})
export class CampaignListComponent implements OnInit, OnDestroy {
  campaign_list: any = [];
  campaign_list_image: any = [];
  subscriptions: Subscription[] = [];
  data_loaded: boolean = false;
  user_data: any = {};
  type: number = 1;
  LANG: any = {};
  currentDate: any = new Date();
  closedDates: any[] = [];
  timeDiff: any[] = [];
  closedOpportunites: any[] = [];
  currLang: any;
  intervalSubscription: Subscription = new Subscription();
  isUserOpportunites: boolean = false;
  walletHistoryData: any;
  constructor(
    private campaignService: CampaignService,
    private router: Router,
    private statmentsService: StatementsService,
    private shared: SharedService,
    public decryptAES: decryptAesService,
    public setingservice: SettingService
  ) {
    const user_data = btoa(btoa('user_info_web'));
    if (localStorage.getItem(user_data) != undefined) {
      this.user_data = JSON.parse(
        atob(atob(localStorage.getItem(user_data) || '{}'))
      );
    }

    this.changeLanguage();
  }

  ngOnInit(): void {
    this.getcampaigns(null,null,null,this.user_data.role_type);

   
  }
  changeLanguage() {
    this.shared.getLang().subscribe((lang) => {
      if (lang == 'ar') {
        this.currLang = 'ar';
        this.LANG = environment.arabic_translations;
      } else {
        this.currLang = 'en';
        this.LANG = environment.english_translations;
      }
    });
  }
  getcampaigns(user_id?: any, type?: any, opportunitiesArr?: any,role_type?:any) {

    this.timeDiff = [];
    this.campaign_list = [];
    this.closedOpportunites = [];
    this.subscriptions.push(
      this.campaignService.getCampaignList().subscribe((res: any) => {
        if (res) {
          this.campaign_list = res.response;

          this.campaign_list_image = res.response.campaign_image;
          this.currentDate = new Date();

          this.campaign_list.forEach((campaign:any) => {
            if (
              campaign.open_date !== null &&
              campaign.close_date &&
              campaign.close_date !== null &&
              campaign.open_date
            ) {
              let closeDate = new Date(campaign.close_date);
              let openDate = new Date(campaign.open_date);
              if (openDate.getTime() < closeDate.getTime()) {
                if (
                  closeDate > this.currentDate &&
                  openDate < this.currentDate
                ) {
                  this.timeDiff.push({
                    type: 'closedDate',
                    firstDate: closeDate.getTime(),
                    id: campaign.id,
                  });
                } else if (
                  openDate > this.currentDate &&
                  closeDate > this.currentDate
                ) {
                  this.timeDiff.push({
                    type: 'openedDate',
                    firstDate: openDate.getTime(),
                    id: campaign.id,
                  });
                } else {
                  this.closedOpportunites.push(campaign);
                  if (this.currLang == 'ar') {
                    this.timeDiff.push({
                      type: 'outDated',
                      firstDate: 'هذه الفرصة مغلقة',
                      id: campaign.id,
                    });
                  } else {
                    this.timeDiff.push({
                      type: 'outDated',
                      firstDate: 'This opprotunity is Closed',
                      id: campaign.id,
                    });
                  }
                }
              } else {
                this.closedOpportunites.push(campaign);
                this.timeDiff.push({
                  type: 'nullTime',
                  firstDate: null,
                  id: campaign.id,
                });
              }
            } else {
              this.closedOpportunites.push(campaign);
              this.timeDiff.push({
                type: 'nullTime',
                firstDate: null,
                id: campaign.id,
              });
            }
          });
          if (type == 1) {
            this.campaign_list = res.response;
            
           
          } else if (type == 2) {
            this.campaign_list = opportunitiesArr;
          } else if (type == 3) {
            this.campaign_list = this.closedOpportunites;
          }
          if(role_type==3){
            this.campaign_list=this.campaign_list.filter((camp:any)=>(camp.user_id==this.decryptAES.decryptAesCbc(this.user_data.id,environment.decryptionAES.key,environment.decryptionAES.iv)))
          }
          this.timeDiff.map((time) => {
            if (time.firstDate !== null) {
              let days = Math.floor(
                (time.firstDate - this.currentDate) / (1000 * 60 * 60 * 24)
              );
              let hours = Math.floor(
                ((time.firstDate - this.currentDate) % (1000 * 60 * 60 * 24)) /
                  (1000 * 60 * 60)
              );
              let minutes = Math.floor(
                ((time.firstDate - this.currentDate) % (1000 * 60 * 60)) /
                  (1000 * 60)
              );
              time.days = days;
              time.hours = hours;
              time.minutes = minutes;
              time.timeString = '';
            } else if (
              time.firstDate === 'This opprotunity is Closed' ||
              time.firstDate === 'هذه الفرصة مغلقة'
            ) {
              if (this.currLang == 'ar') {
                time.timeString = 'هذه الفرصة مغلقة';
              } else {
                time.timeString = 'This opprotunity is Closed';
              }
            } else {
              if (this.currLang == 'ar') {
                time.timeString = 'الفترة لم تحدد بعد';
              } else {
                time.timeString = 'Period not defined Yet';
              }
            }
          });
          this.campaign_list.map((camp: any) => {
            this.timeDiff.forEach((time) => {
              if (camp.id == time.id) {
                camp.time = time;
              }
            });
          });
          
        }
      })
    );
    this.data_loaded = true;
  }
  goToDetails(data: any) {
    if (this.type == 1) {
      this.router.navigate(['/campaign-details'], {
        queryParams: { campaign_id: btoa(btoa(data.id)) },
      });
      return;
    }
    this.router.navigate(['/profit'], {
      queryParams: { id: btoa(btoa(data.id)) },
    });
  }

  getUserCampaigns() {
    this.campaign_list = [];
  
      this.statmentsService
        .getUserCampaigns(this.user_data.id)
        .subscribe((res: any) => {
          this.campaign_list = res.response;
          this.setingservice
            .walletHistory(this.user_data.role_type, this.user_data.id)
            .subscribe((res: any) => {
              if (res.status) {
                this.walletHistoryData = res.response.data.wallet_data;
                this.campaign_list.map((card: any) => {
                  let sum = 0;
                  this.walletHistoryData.forEach((element: any) => {
                    if (card.id == element.opportunity_id) {
                      sum += element.debit_amount;
                      card.sukukVal = sum / card.share_price;
                    }
                  });
                });
              }
              this.getcampaigns(null, 2, this.campaign_list);
            });

        })
   
  }

  changeTabs(type: number) {
    this.type = type;
    this.data_loaded = false;
    this.campaign_list = [];
    if (type == 1) {
      this.isUserOpportunites = false;
      if (this.user_data.role_type == 3) {
        this.getcampaigns(this.user_data.id, type,null,this.user_data.role_type);
        return;
      }
      this.getcampaigns(null,null,null,this.user_data.role_typ);
      return;
    }
    if (type == 2) {
      this.isUserOpportunites = true;
      this.getUserCampaigns();
      return;
    }
    if (type == 3) {
      this.isUserOpportunites = false;
      this.getcampaigns(null, type,null,this.user_data.role_type);
      return;
    }
    setTimeout(() => {
      this.data_loaded = true;
    }, 10000);
  }

  navTo(list: any, counterData: any) {
    if (list != null) {
      this.shared.setOpportunity(list, counterData);
      this.router.navigateByUrl(`/dashboard/${btoa(list.id)}`);
    }
  }
  ngOnDestroy() {}
}
