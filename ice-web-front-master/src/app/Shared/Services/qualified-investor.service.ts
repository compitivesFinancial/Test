import { Injectable } from '@angular/core';
import { apiServiceComponent } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class QualifiedInvestorService {
  private url: string = '';
  public campaignDetail: any;

  constructor(private api: apiServiceComponent) {}
  /********************************************************************/
  addQualifiedInvestor(data: Object) {
    this.url = 'addQualifiedInvestorAttach';
    return this.api.post(this.url, data);
  }
  /********************************************************************/
  getQualifiedInvestorData(investor_id: any) {
    this.url = `getQualifiedInvestorAttach/${investor_id}`;
    return this.api.get(this.url, '');
  }
}
