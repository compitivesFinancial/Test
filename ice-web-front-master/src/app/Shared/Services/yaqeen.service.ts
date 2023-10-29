import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { YaqeenData } from '../Models/YaqeenData';
import { apiServiceComponent } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class YaqeenService {

  //   private baseUrl = `http://localhost/cfc/admin_laravel/web_api/public/api/yaqenIqama?iqama=2130635150&birthDateG=1978-12`;
  // public statusss!:string;
  //   constructor(private httpClient:HttpClient) { }
  private url: string = "";

  /***********************************************************************************/

  constructor(private api: apiServiceComponent) {
  }
  // getYaqeenData(): Observable<YaqeenData> {
  //   return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
  //     map(response => response._embedded.response)
  //   )
  // }

  /***********************************************************************************/
  getYaqeenIqamaData(iqama: string, birthDateG: string) {
    this.url = `yaqenIqama?iqama=${iqama}&birthDateG=${birthDateG}`;
    return this.api.get(this.url, "");
  }
  /***********************************************************************************/
  getYaqeenSaudiData(nin: string, birthDateG: string) {
    this.url = `yaqeensaudi?nin=${nin}&dateString=${birthDateG}`;
    return this.api.get(this.url, "");
  }
}
/***********************************************************************************/

interface GetResponse {
  _embedded: {
    status: YaqeenData
    response: YaqeenData;
  }
}
