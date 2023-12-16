import { Injectable } from '@angular/core';
import { apiServiceComponent } from './api.service';

@Injectable({ providedIn: 'root' })
export class BankapiService {
  private url: string = '';
  public anbDetail: any;
  private fullUrl=``;
  constructor(private api: apiServiceComponent) {}

  payment(amount: any,debitAccount:any,creditAccount:any,campgain_id:any) {
    this.url = `payment?amount=${amount}`+`&debitAccount=${debitAccount}`+`&creditAccount=${creditAccount}`+`&campgain_id=${campgain_id}`;
    return this.api.post(this.url, '');
  }

  bankAuth() {
    this.url = 'bankAuth';
    return this.api.get(this.url, '');
  }

}
