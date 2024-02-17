import { Injectable } from '@angular/core';
import { apiServiceComponent } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private url: string = '';
  public campaignDetail: any;

  constructor(private api: apiServiceComponent) {
   }

    /********************************************************************/
    getInvestorCampaignStatement(campaign_id: any) {
      this.url = `investor_campaign_statment/${campaign_id}`;
      return this.api.get(this.url, '');
    }
    getInvestorNearestDate(){
      this.url = `nearestDate`;
      return this.api.get(this.url, '');
    }
}
