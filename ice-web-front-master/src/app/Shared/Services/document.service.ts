import { Injectable } from '@angular/core';
import { apiServiceComponent } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private url: string = '';
  selectedCampaign: any;
  /***********************************************************************************/

  constructor(private api: apiServiceComponent) {}

  /***********************************************************************************/
  getUserDetails(user_id: string) {
    this.url = `get_user_detail/${user_id}`;
    return this.api.get(this.url, '');
  }
  /***********************************************************************************/
  getSukukDetails(user_id: string, campaign_id: string) {
    this.url = `campaginWithKyc/${user_id}/${campaign_id}`;
    return this.api.get(this.url, '');
  }
}
