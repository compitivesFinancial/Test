import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';
import { CampaignService } from 'src/app/Shared/Services/campaign.service';
import { SettingService } from './setting.service';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { environment } from 'src/environments/environment.prod';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';
declare const $: any;
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
})
export class SettingComponent implements OnInit {
  user_data: any = {};
  dashboard_data: any = {};
  public totalDetails: any;
  public walletBorrower: any;
  public walletInvestor: any;
  public investorDetails: any;
  public walletFund: any;
  walletFundBorower: any;
  amount: any = '';
  subscriptions: Subscription[] = [];
  LANG: any = '';
  walletInvestorSum: any;
  walletBorrowerSum: any;
  walletHistoryData: any = null;
  loading: boolean=false;
  status: any;
  constructor(
    private shared: SharedService,
    private campaignService: CampaignService,
    public setingservice: SettingService,
    public router: Router,
    public toast: ToastrService,
    public decryptAES: decryptAesService
  ) {
    const user_data = btoa(btoa('user_info_web'));
    if (localStorage.getItem(user_data) != undefined) {
      this.user_data = JSON.parse(
        atob(atob(localStorage.getItem(user_data) || '{}'))
      );
    }

    this.changeLanguage();
    this.getwalletHistory();
  }
  changeLanguage() {
    this.shared.getLang().subscribe((lang) => {
      if (lang == 'ar') {
        this.LANG = environment.arabic_translations;
      } else {
        this.LANG = environment.english_translations;
      }
    });
  }
  ngOnInit(): void {
    $('.chart').easyPieChart({
      easing: 'easeOutElastic',
      delay: 3000,
      barColor: '#00C48A',
      trackColor: '#DBF8EE',
      scaleColor: false,
      lineWidth: 5,
      trackWidth: 2,
      size: 125,
      lineCap: 'round',
      onStep: function (from: any, to: any, percent: any) {
        this.el.children[0].innerHTML = Math.round(percent);
      },
    });

    if (this.user_data.role_type == 3) {
      // this.TotalDetails()
      this.getWalletBorrower();
      this.getWallerBorrowerSum();
    }

    if (this.user_data.role_type == 2) {
      // this.getInvestorDEtails();
      // this.getInvestorWallet();
      this.getWalletInvestorSum();
    }

    this.getDashboardDetails();
  }

  getPercent(a: any, b: any) {
    return (a / b) * 100;
  }
  getwalletHistory() {
    this.loading=true;
    this.setingservice
      .walletHistory(this.user_data.role_type, this.user_data.id)
      .subscribe((res: any) => {
        if (res.status) {
          this.status=res.status
          this.walletHistoryData = res.response.data.wallet_data;
          this.walletHistoryData.map((transaction: any) => {
            res.response.data.campgain_name.forEach((campagin: any) => {
              if (campagin.id == transaction.opportunity_id) {
                transaction.opportunity_name = campagin.tagline?campagin.tagline:'';
            
              }
            });
          });
          this.loading=false;
        }
      });
  }
  getDashboardDetails(type?: number) {
    const data = { user_id: this.user_data.id };
    this.campaignService.investorDashboard(data, type).subscribe((res: any) => {
      this.dashboard_data = res.response.data.investor_id;
    });
  }

  async getWalletBorrower() {
    await this.setingservice
      .walletBorrower(this.user_data.id)
      .subscribe((res: any) => {
        if (res.status) {
          this.walletBorrower = res;
        } else {
          this.walletBorrower = res;
          this.toast.success(res.response.data);
        }
      });
  }
  TotalDetails() {
    this.setingservice
      .walletDashboard(this.user_data.id)
      .subscribe((res: any) => {
        this.totalDetails = res.response.active_funds;
        this.walletFundBorower = res.response;
        //  console.log(this.totalDetails);
      });
  }
  public roundof: any;
  roundOF(a: any) {
    return Math.round((a + Number.EPSILON) * 100) / 100;
  }

  navToDetails(opertunityDetailList: any) {
    if (opertunityDetailList.id > 0) {
      this.router.navigateByUrl(
        `/operationdetails/${btoa(opertunityDetailList.id)}`
      );
    }
  }

  navToDetailsInvest(opertunityDetailList: any) {
    if (opertunityDetailList > 0) {
      this.router.navigateByUrl(
        `/operationdetails/${btoa(opertunityDetailList)}`
      );
    }
  }

  // getInvestorWallet() {
  //   this.setingservice
  //     .walletInvestor(this.user_data.id)
  //     .subscribe((res: any) => {
  //       if (res.status) {
  //         this.walletInvestor = res;
  //       } else {
  //         this.walletInvestor = res;
  //         this.toast.success(res.response.data);
  //       }
  //     });
  // }
  getInvestorDEtails() {
    this.setingservice
      .investorDetails(this.user_data.id)
      .subscribe((res: any) => {
        this.investorDetails = res.response.active_funds;
        this.walletFund = res.response;
        // console.log(this.investorDetails);
      });
  }

  addmoney() {
    let data = {
      invester_id: this.user_data.id,
      amount: this.amount,
    };
    this.setingservice.addmoney(data).subscribe((res: any) => {
      this.toast.success(res.response.message);
      this.ngOnInit();
    });
  }
  async getWallerBorrowerSum() {
    await this.setingservice.walletBorrowerSum().subscribe((res: any) => {
      this.walletBorrowerSum = res.response;
    });
  }
  async getWalletInvestorSum() {
    await this.setingservice.walletInvestorSum().subscribe((res: any) => {
      this.walletInvestorSum = res.response;
    });
  }
}
