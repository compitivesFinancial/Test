import { Injectable } from '@angular/core';
import * as md5 from 'md5';
import { apiServiceComponent } from '../Services/api.service';
import { FirebaseConfigService } from './firebase-config.service';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';
import 'firebase/auth';
import { error } from 'console';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private url: string = '';
  private dataResult: any;

  presentUser: any;

  constructor(
    private api: apiServiceComponent,
    public firebaseAuth: AngularFireAuth
  ) {}

  encryptPassword(password: any) {
    return md5(password);
  }

  getData(url: any, data: any): void {
    if (!!url && !!data) {
      if (url == 'login_verify_otp') {
        firebase
          .auth()
          .createUserWithEmailAndPassword(
            data.email,
            this.encryptPassword(data.otp + data.email + data.otp)
          )
          .then((firebaseRes) => {
            localStorage.setItem(
              'firebaseUser',
              JSON.stringify(firebaseRes.user)
            );
            // console.log("res from Firebase", firebaseRes);
          });
      } else if (url == 'login') {
        firebase
          .auth()
          .createUserWithEmailAndPassword(data.email, data.password)
          .then((firebaseRes) => {
            localStorage.setItem(
              'firebaseUser',
              JSON.stringify(firebaseRes.user)
            );
            // console.log("res from Firebase", firebaseRes);
          });
      }
    }
  }
  getToken() {
    if (!!this.dataResult.response.token) {
      return this.dataResult.response.token;
    }
  }
  register(data: Object) {
    this.url = 'register';
    return this.api.post(this.url, data);
  }

  checkMobile(data: Object) {
    this.url = 'check_mobile';
    return this.api.post(this.url, data);
  }

  userLogin(data: Object) {
    this.url = 'login';
    this.getData(this.url, data);
    return this.api.post(this.url, data);
  }

  logout() {
    this.url = 'logout';
    let query = '';
    return this.api.post(this.url, query);
  }

  search(data: Object) {
    this.url = 'search';
    return this.api.post(this.url, data);
  }

  loginWithOtp(data: object) {
    this.url = 'login_verify_otp';
    // console.log('data', data);
    this.getData(this.url, data);
    return this.api.post(this.url, data);
  }

  sendOtp(data: object) {
    this.url = 'send_otp';
    return this.api.post(this.url, data);
  }
  sendOtpRegestration(data: object) {
    this.url = 'send_otp_regestration';
    return this.api.post(this.url, data);
  }

  verifyOtp(data: object) {
    this.url = 'verify_otp';
    return this.api.post(this.url, data);
  }

  getProfileDetails(data: object, type?: number) {
    this.url = 'borrower_profile';
    if (type == 1) {
      this.url = 'invester_profile';
    }
    return this.api.post(this.url, data);
  }

  termsandCondition() {
    // this.url = "get_page_by_idoutside/3"
    //Change By Qaysar To check The data return from API
    this.url = 'get_page_by_id/3';
    return this.api.get(this.url, '');
  }

  termsandConditionOutside() {
    // this.url = "get_page_by_idoutside/3"
    //Change By Qaysar To check The data return from API
    this.url = 'get_page_by_id_outside/3';
    return this.api.get(this.url, '');
  }
  profileEdit(data: any) {
    this.url = 'borrower_profile_update';
    return this.api.post(this.url, data);
  }

  changePassword(data: any) {
    this.url = 'borrower_password_update';
    return this.api.post(this.url, data);
  }
}
