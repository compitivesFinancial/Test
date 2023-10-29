import { Injectable } from '@angular/core';
import {apiServiceComponent} from '../../Shared/Services/api.service';
@Injectable({
  providedIn: 'root'
})
export class InvestmentService {

  private url: string =""
  constructor(public api:apiServiceComponent) {}

  totalOppertunities(id:any){
    this.url="user_campaign_borrower/"+id+"/1";
    
    return this.api.get(this.url,"")
  }

  totalInvested(id:any){
    this.url ="user_campaign_invester/"+id+"/1"
    return this.api.get(this.url,"")
  }

  closedInvested(id:any){
    this.url ="user_campaign_invester/"+id+"/2"
    return this.api.get(this.url,"")
  }

  opertunityDetails(id:any){
    this.url="opportunity_detail/"+id;
    return this.api.get(this.url,"")
  }
  closeOppertunities(id:any){
    this.url="user_campaign_borrower/"+id+"/2";
    
    return this.api.get(this.url,"")
  }

  
}
