import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SettingService } from '../setting.service';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';

@Component({
  selector: 'app-operationdetails',
  templateUrl: './operationdetails.component.html',
  styleUrls: ['./operationdetails.component.css']
})
export class OperationdetailsComponent implements OnInit {
  public requestId: any
  user_data: any
  public oppertunityDetailsList: any
  public upcomingPayment: boolean = false
  LANG: any = "";
  subscriptions: Subscription[] = []


  constructor(private shared: SharedService, private route: ActivatedRoute, public settingservice: SettingService, private toast: ToastrService,public decryptAES:decryptAesService) {
    const user_data = btoa(btoa("user_info_web"));
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
    this.requestId = atob(this.route.snapshot.params['id']);
    if (this.requestId != null) {
      // this.investmentDetails()
    //  console.log(this.requestId);


    }
    this.oppertunityDetails()
    this.investorDetails()
  }

  public receivedinvestment: any
  public campaignName: any
  public amount_data: any
  public totalAmount: any
  public principleAmount: any
  public upcomingInvestmentList: any
  public transactionID: any
  public receiveddebit: any
  public receivedcredit: any
  oppertunityDetails() {
    this.settingservice.opertunityDetails(this.requestId).subscribe((res: any) => {
      this.oppertunityDetailsList = res.response
     // console.log(this.oppertunityDetailsList, 'here');

      this.receivedinvestment = res.response.transaction_history
      // this.receiveddebit = res.response.investor_debit_history

      this.upcomingInvestmentList = res.response.upcomming_payments
      this.campaignName = res.response.campaign
      this.amount_data = res.response

      this.transactionID = Math.floor((Math.random() * 1000000) + 1)

    })
  }

  public investorWalletDetails: any
  investorDetails() {
    let data = {
      'campaign_id': this.requestId,
      'user_id': this.user_data.id
    }
    this.settingservice.investorWalletDetails(data).subscribe((res: any) => {
      this.receivedcredit = res.response.investor_credit_history
      this.receiveddebit = res.response.investor_debit_history
      this.investorWalletDetails = res.response
    })
  }

  TotalInvestment(a: any, b: any) {
    this.totalAmount = `${a + b}`
    return (this.totalAmount)
  }

  principleRemain() {
    this.principleAmount = this.totalAmount - this.amount_data.amount_paid
    return (this.principleAmount)
  }
  public amount: any
  principleRemainInvestor() {
    this.amount = this.totalAmount - this.investorWalletDetails.old_withdrawal
   // console.log();

    return (this.amount)
  }

  payNow() {
    if (this.amount_data.due_ids != null) {
      let data = {
        'user_id': this.campaignName.user_id,
        'due_ids': this.amount_data.due_ids
      }
      this.settingservice.payNow(data).subscribe((res: any) => {
        this.toast.success(res.response.message)
        this.ngOnInit()
      })
    }
  }

  upcoming() {
    this.upcomingPayment = true
  }

  withdraw() {
    let data = {
      "campaign_id": this.requestId
    }
    //console.log(data);

    this.settingservice.withdrawl(data).subscribe((res: any) => {
      this.toast.success("Amount Withdraw")
      this.ngOnInit()
    })

  }

}
