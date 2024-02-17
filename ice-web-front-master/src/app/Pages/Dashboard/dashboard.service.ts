import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {apiServiceComponent} from '../../Shared/Services/api.service';

@Injectable({
  providedIn: 'root'
})


export class DashboardService {
  private url: string =""


  constructor(public api:apiServiceComponent, public http:HttpClient) { }


  sendOtpKyc(nationality: string,user_id:any) {
    return this.api.getAbsherOTP(nationality,user_id);
  }
  opertunityDetails(id:any){
    this.url="opportunity_detail/"+id;
    return this.api.get(this.url,"")
  }
  programInfo(id:any){
    this.url="index_prog?campgin_id="+id;
    return this.api.post(this.url,"")
  }
  programInfoInvestor(id:any){
    this.url="index_psd?campgin_id="+id;
    return this.api.post(this.url,"")
  }
  sendOTPCheck(otp:string,user_id:any){
    this.url="checkOtpAbsher?otp="+otp+"&user_id="+user_id;
    return this.api.post(this.url,"")
  }
  investmentsCount(id:any){
    this.url="userInvestorCount/id="+id;
    return this.api.get(this.url,"")
  }
  onPay(data:any){
    this.url ="invest"
    return this.api.postPayInves(this.url,data)
  }
  // onPay(data:any,amount:string,campaign:string,investor:string){
  //   // this.url ="invest"
  //   return this.api.postPayInves(data,amount,campaign,investor);
  // }
//   on2Pay(data:any){
//     this.url = "https://test-anb.mtf.gateway.mastercard.com/api/rest/version/69/merchant/1050/session"
//     let headers= new HttpHeaders()
//     headers=headers.set
// (
//     'Authorization', 'Basic bWVyY2hhbnQuMTA1MDo5MTRhYzgwYzZhOTA5MGRkYjBiNDM4ZmNhMGRhM2EyMA=='
// )
//     return this.http.post(this.url,data,{headers})
//   }

dashDEtails(data:any){
  this.url="borrowerdashboard"
  return this.api.post(this.url,data)
}
profileDetails(data:any){
  this.url="borrower_profile"
  return this.api.post(this.url,data)
}

investorDashDetails(data:any){
  this.url= "investordashboard"
  return this.api.post(this.url,data)
}

getBankAccountNumber(){
  this.url= "account_number"
  return this.api.get(this.url,'')
}
getCampaignInvestPerc(id:any){
  this.url= `campaignInvestPerc/${id}`
  return this.api.get(this.url,'')
}
getCampaignById(id:any){
  this.url= `get_campaign_by_id/${id}`
  return this.api.get(this.url,'')
}
campgainSubscribe(id:any){
  this.url= `campgain_subscribe?campgain_id=${id}`
  return this.api.get(this.url,'')
}
}
