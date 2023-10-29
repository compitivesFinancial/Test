import { Injectable } from '@angular/core';
import { apiServiceComponent } from 'src/app/Shared/Services/api.service';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  private url: string =""
  constructor(public api:apiServiceComponent) { }

  walletDashboard(id:any){
    this.url="wallet_dashboard/"+id;
    return this.api.get(this.url,"")
  }
  walletBorrower(id:any){
    this.url="wallet_borrower/"+id;
    return this.api.get(this.url,"")
  }

  walletInvestor(id:any){
    this.url="wallet_investor/"+id;
    return this.api.get(this.url,"")
  }
  opertunityDetails(id:any){
    this.url="opportunity_detail/"+id;
    return this.api.get(this.url,"")
  }

  investorWalletDetails(data:any){
    this.url ="invester_wallet_detail"
    return this.api.post(this.url,data)
  }

  investorDetails(id:any){
    this.url ="investor_wallet_dashboard/"+id
    return this.api.get(this.url,"")
  }

  payNow(data:any){
    this.url ="payloan"
    return this.api.post(this.url,data)
  }

  withdrawl(data:any){
    this.url ="withdraw"
    return this.api.post(this.url,data)
  }

  addmoney(data:any){
    this.url = "add_money_wallet"
    return this.api.post(this.url,data)
  }
  walletInvestorSum(){
    this.url ="wallet_investor_sum"
    return this.api.get(this.url,"")
  }
  walletBorrowerSum(){
    this.url ="wallet_borrower_sum"
    return this.api.get(this.url,"")
  }

}
