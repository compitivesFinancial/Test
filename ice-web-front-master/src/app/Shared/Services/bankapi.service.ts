import { Injectable } from '@angular/core';
import { apiServiceComponent } from './api.service';

@Injectable({ providedIn: 'root' })
export class BankapiService {
  private url: string = '';
  public anbDetail: any;
  private fullUrl=``;
  constructor(private api: apiServiceComponent) {}

  payment(amount: any) {
    this.url = `payment?amount=${amount}`;
    return this.api.post(this.url, '');
  }

  bankAuth() {
    this.url = 'bankAuth';
    return this.api.get(this.url, '');
  }

}
