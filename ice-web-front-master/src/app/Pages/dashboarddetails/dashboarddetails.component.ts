import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../Dashboard/dashboard.service';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';

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


  constructor(public dashBoardService: DashboardService, private shared: SharedService,public decryptAES:decryptAesService) {
    const user_data = btoa(btoa("user_info_web"));
    // console.log("btoa('user_info_web')",btoa(btoa("user_info_web")))
    if (localStorage.getItem(user_data) != undefined) {
      this.user_data = JSON.parse(atob(atob(localStorage.getItem(user_data) || '{}')));

    }
   
    this.subscriptions.push(this.shared.languageChange.subscribe((path: any) => {
      this.changeLanguage();
    }))
    this.changeLanguage();
  }
  changeLanguage() {
    if (localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
      this.LANG = environment.arabic_translations;
    }
    else {
      this.LANG = environment.english_translations;
    }
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
  }
  dashDetails() {
    let data = {
      'user_id': this.user_data.id
    }
    this.dashBoardService.dashDEtails(data).subscribe((res: any) => {
      this.dashDetailsList = res.response.data
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
