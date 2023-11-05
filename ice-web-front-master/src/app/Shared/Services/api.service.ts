import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { throwError } from 'rxjs'
import { map, catchError } from 'rxjs/operators';
import { configServiceComponent } from './config.service';
import { Observable } from 'rxjs';
import { Footer } from '../Models/footer';


@Injectable({ providedIn: 'root' })
export class apiServiceComponent {
	url: string = "";
	PAYLOAD_DATA: string = "";
	authHeader: any = "";
	type: any = "GET";
	constructor(private http: HttpClient, private config: configServiceComponent) {
		this.url = this.config.getHOST();
	}

	getHeadersInvest(url: string,data:any) {
		this.authHeader = this.config.getAuthHeaders(url);
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Accept-Language': 'en',
			'crossDomain': 'true',
			'city_id': '4',
      'amount':data.amount,
      'campaign':data.campaign,
      'invester':data.invester
		});
		const token = localStorage.getItem("token")
		if (token) {
			headers = headers.set('Authorization', `Bearer ${token}`);
		}
		if (localStorage.getItem("arabic") == "true") {
			headers = headers.set('Accept-Language', "ar");
		}
		return headers;
	}

  getHeaders(url: string) {
		this.authHeader = this.config.getAuthHeaders(url);
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Accept-Language': 'en',
			'crossDomain': 'true',
			'city_id': '4'
      // ,'Access-Control-Allow-Origin': 'https://www.cfc.sa',
      // 'Access-Control-Allow-Credentials': 'true',
      // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      // 'Access-Control-Allow-Headers': 'Authorization, Content-Type'
		});
		const token = localStorage.getItem("token")
		if (token) {
			headers = headers.set('Authorization', `Bearer ${token}`);
		}
		// if(localStorage.getItem("country_id")){
		// 	const country_id=atob(atob(localStorage.getItem("country_id") || "0"))
		// 	headers = headers.set('city_id', country_id);
		// }
		if (localStorage.getItem("arabic") == "true") {
			headers = headers.set('Accept-Language', "ar");
		}
		// const language=localStorage.getItem("arabic");
		// if(language=="true"){
		// 	headers=headers.set("Accept-Language",'ar')
		// }
		// console.log(url)
		return headers;
	}

	get(url: string, pagination: string) {
		this.type = "GET";
		this.PAYLOAD_DATA = pagination;
		let headers = this.getHeaders(url);
		let _url = this.url + url + pagination;
		// if(url == "product_list" || url == "get_page_list" || url.split("/")[0] == "get_page_by_id"){
		// 	_url=this.config.getAdminHOST() + url + pagination;
		// }
		return this.http.get(_url, { headers: headers, withCredentials: true })
			.pipe(map((response: Object) => response),
				catchError(this._errorHandler));
	}
  getAbsherOTP(nationality:string) {
		this.type = "GET";
    let url = `https://api.cfc.sa/api/sendOtpAbsher?nationality=${nationality}`;
		let headers = this.getHeaders(url);
		return this.http.get(url, { headers: headers, withCredentials: true })
			.pipe(map((response: Object) => response),
				catchError(this._errorHandler));
	}
	getFooter(url: string, pagination: string): Observable<Footer[]> {
		this.type = "GET";
		this.PAYLOAD_DATA = pagination;
		let headers = this.getHeaders(url);
		let _url = this.url + url + pagination;
		return this.http.get<GetResponseFooter>(_url, { headers: headers, withCredentials: true }).pipe(
			map(response => response.response)
		)
	}

	getWatheq(url: string, pagination: string) {
		this.type = "GET";
		this.PAYLOAD_DATA = pagination;
		let headers = this.getHeaders(url);
		headers.set('Accept', `application/json`);
		headers.set('Host', `<calculated when request is sent>`);
		let _url = this.url + url + pagination;

		return this.http.get(_url, { headers: headers, withCredentials: true })
			.pipe(map((response: Object) => response),
				catchError(this._errorHandler));

	}

	post(url: string, data1: any) {
		this.type = "POST";
		this.PAYLOAD_DATA = data1;
		let headers = this.getHeaders(url);
		let _url = this.url + url;
		let data = JSON.stringify(data1);
		return this.http.post(_url, data, { headers: headers, withCredentials: true })
			.pipe(map((response: Object) => response),
				catchError(this._errorHandler));
	}
  postPayInves(url: string, data1: any) {
		this.type = "POST";
		this.PAYLOAD_DATA = data1;
		let headers = this.getHeadersInvest(url,data1);
		let _url = this.url + url;
		let data = JSON.stringify(data1);
		return this.http.post(_url, data, { headers: headers, withCredentials: true })
			.pipe(map((response: Object) => response),
				catchError(this._errorHandler));
	}

	_errorHandler(error: Response) {
		return throwError(error || "Server Error");
	}
}

interface GetResponseFooter {
	response: Footer[];
}
