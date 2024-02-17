import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../Dashboard/dashboard.service';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { environment } from 'src/environments/environment.prod';
import { Subscription } from 'rxjs';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';
import { LoginService } from 'src/app/Shared/Services/login.service';
import { ActivatedRoute } from '@angular/router';
import { WalletService } from 'src/app/Shared/Services/wallet.service';

@Component({
  selector: 'app-dashboarddetails',
  templateUrl: './dashboarddetails.component.html',
  styleUrls: ['./dashboarddetails.component.css']
})
export class DashboarddetailsComponent implements OnInit {
  subscriptions: Subscription[] = [];
  user_data: any = {};
  LANG: any = {};
  public dashDetailsList: any = ''
  public profileDetails: any = ''
  public invesorDashDetails: any = ''
  disabled_inputs: boolean=false;
  selectedOpportunity: any;
  investmentStatement: any[]=[];

  constructor(public dashBoardService: DashboardService, private shared: SharedService,public decryptAES:decryptAesService,  private loginService: LoginService ,
    public dashboardService: DashboardService,
    private walletService: WalletService,) {
    const user_data = btoa(btoa("user_info_web"));
    // console.log("btoa('user_info_web')",btoa(btoa("user_info_web")))
    if (localStorage.getItem(user_data) != undefined) {
      this.user_data = JSON.parse(atob(atob(localStorage.getItem(user_data) || '{}')));

    }
   
   
    this.subscriptions.push(
      this.walletService
        .getInvestorNearestDate()
        .subscribe((res: any) => {
          this.investmentStatement.push(res.response.message)
        })
    );
    this.changeLanguage();
  }
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

 



  ngOnInit(): void {
    if (this.user_data.role_type == 2) {
      this.investorDashdetails()
      this.profile()
    }
    if (this.user_data.role_type == 3) {
      this.dashDetails()
      this.profile()
    }
    const data = { id: this.user_data.id };
    this.loginService.getProfileDetails(data, undefined).subscribe((res: any) => {
      if (res.response.kyc_approved_status == 1) {
        this.disabled_inputs = true;
      }
    })
  }
  dashDetails() {
    let data = {
      'user_id': this.user_data.id
    }
    this.dashBoardService.dashDEtails(data).subscribe((res: any) => {
      this.dashDetailsList = res.response.data
      console.log("")
    })
  }
  roundOF(a: any) {
    return Math.round((a + Number.EPSILON) * 100) / 100



  }

  profile() {
    let data = {
      'id': this.user_data.id
    }

    this.dashBoardService.profileDetails(data).subscribe((res: any) => {
      this.profileDetails = res.response;
      
      this.profileAcountNumber();
      //must be an encryption code
      //console.log("this.profileDetails", this.profileDetails);

    })
  }

  profileAcountNumber() {
    this.dashBoardService.getBankAccountNumber().subscribe((res: any) => {
      this.profileDetails.account_number = res.response.account_number;
    })
  }

  spreadO: any
  investorDashdetails() {
    let data = {
      'user_id': this.user_data.id
    }
    this.dashBoardService.investorDashDetails(data).subscribe((res: any) => {
      this.invesorDashDetails = res.response.data
      // const numberClone = this.invesorDashDetails.total_investment
    })

  }

}
