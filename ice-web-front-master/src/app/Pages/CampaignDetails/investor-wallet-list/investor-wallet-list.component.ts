import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from 'src/app/Shared/Services/campaign.service';
import { DocumentService } from 'src/app/Shared/Services/document.service';
import { DashboardService } from '../../Dashboard/dashboard.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { WalletService } from 'src/app/Shared/Services/wallet.service';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';

@Component({
  selector: 'app-investor-wallet-list',
  templateUrl: './investor-wallet-list.component.html',
  styleUrls: ['./investor-wallet-list.component.css'],
})
export class InvestorWalletListComponent implements OnInit {
  LANG: any = {};
  subscriptions: Subscription[] = [];
  user_data: any = {};
  selectedOpportunity: any;
  requestId: any;
  investmentStatement: any;

  constructor(
    private route: ActivatedRoute,
    private campaignService: CampaignService,
    public dashboardService: DashboardService,
    private shared: SharedService,
    private walletService: WalletService,
    public decryptAES:decryptAesService
  ) {
    const user_data = btoa(btoa('user_info_web'));
    if (localStorage.getItem(user_data) != undefined) {
      this.user_data = JSON.parse(
        atob(atob(localStorage.getItem(user_data) || '{}'))
      );
    }
   
    this.requestId = atob(this.route.snapshot.params['id']);
   
    this.subscriptions.push(
      this.walletService
        .getInvestorCampaignStatement(this.requestId)
        .subscribe((res: any) => {
          this.investmentStatement = res.response
        })
    );
    this.changeLanguage();
  }

  ngOnInit(): void {}
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
