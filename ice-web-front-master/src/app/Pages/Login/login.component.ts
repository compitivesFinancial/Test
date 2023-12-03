import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, timer } from 'rxjs';
import { login_data } from 'src/app/Shared/Models/login.model';
import { errorHandlerService } from 'src/app/Shared/Services/errorHandler.service';
import { LoginService } from 'src/app/Shared/Services/login.service';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  mobile_number: string = ""; 
  password: string = "";
  country_code: string = "+966";
  load: boolean = false;
  err: boolean = false;
  show_password: boolean = true;
  login_error: any = {};
  subscriptions: Subscription[] = []
  show_otp: boolean = false;
  showResend: boolean = false;
  otp1: string = "";
  otp2: string = "";
  otp3: string = "";
  otp4: string = "";
  // otp5:string="";
  // otp6:string="";
  downloadTimer: any;
  count: number = 0;
  LANG: any = {};
  email: string = "";
  isSignedInFirebase: boolean = false;
  emailaddon: any="";


  constructor(private toast: ToastrService, private loginService: LoginService, @Inject(DOCUMENT) private document: Document, private shared: SharedService, private error: errorHandlerService, private router: Router) {
   
    this.changeLanguage();


  }

  ngOnInit(): void {}


  changeLanguage() {
    
    this.shared.getLang().subscribe(lang => {
      if(lang=='ar'){
        this.LANG = environment.arabic_translations;
      }
      else {
        this.LANG = environment.english_translations;
        
      }
    });
  }


  showLoginPassword() {
    this.show_password = !this.show_password;
  }
  forgetPassword() {
    // console.log("Forget Password From Login Page");
  }

  errorHandler() {
    // this.mobileErrorHandler();
    if (this.email == "" || this.email == undefined) {
      this.login_error.email_id = true;
      this.err = true;
    }

    if (!this.login_error.email_id && this.checkEmail(this.email)) {
      this.login_error.email_id_valid = true;
      this.err = true;
    }
    if (this.show_password) {
      if (this.password == "" || this.password == undefined) {
        this.login_error.password = true;
        this.err = true;
      }
      if (!this.login_error.password && this.checkPassword(this.password)) {
        this.login_error.password_valid = true;
        this.err = true;
      }
    }
  }

  changeCountryCode() {
    this.login_error.mobile_number_valid = false;
  }

  checkPassword(password: string) {
    if (password.length < 8) {
      return true
    }
    return
  }


  // mobileErrorHandler(){
  //   if(this.mobile_number == ""  || this.mobile_number == undefined){
  //     this.login_error.mobile_number=true;
  //     this.err=true;
  //   }
  //   if(this.country_code == "+966"){
  //     const re=/^([0]{1}[5]{1}[0-9]*)$/
  //     const re1=/^([5]{1}[0-9]*)$/
  //     if(!this.login_error.mobile_number && !re.test(this.mobile_number) && !re1.test(this.mobile_number)){
  //       this.login_error.mobile_number_valid=true;
  //       this.err=true;
  //     }

  //     if(!this.login_error.mobile_number && re.test(this.mobile_number) && this.mobile_number.length != 10){
  //       this.login_error.mobile_number_valid=true;
  //       this.err=true;
  //     }

  //     if(!this.login_error.mobile_number && re1.test(this.mobile_number) && this.mobile_number.length != 9){
  //       this.login_error.mobile_number_valid=true;
  //       this.err=true;
  //     }
  //     return
  //   }
  //   if(this.country_code == "+91"){
  //     if(this.login_error.mobile_number == false && this.mobile_number.length != 10){
  //       this.login_error.mobile_number_valid=true;
  //       this.err=true;
  //     }
  //     return
  //   }
  //   if(this.login_error.mobile_number == false && (this.mobile_number.length < 8 || this.mobile_number.length > 10)){
  //     this.login_error.mobile_number_valid=true;
  //     this.err=true;
  //   }
  // }

  checkEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !re.test(email)
  }

  sendOTP() {
    if (this.load) return;
    this.err = false;
    this.resetError();
    this.errorHandler();
    if (!this.err) {
      this.load = true;
      localStorage.setItem("emailLogin",this.email);
      if(!!localStorage.getItem("emailLogin")){
        this.emailaddon=this.email;
      }
      this.emailaddon=this.email;
      if (this.show_password) {
        this.checkMobile();
        return
      }
      // this.otpFromPhp(this.mobile_number);
      this.otpFromPhp(this.email);
    }
  }

  otpFromPhp(email: string, type?: number) {
    const data = {
      "email": email,
      // "country_code": this.country_code
    }
    this.subscriptions.push(this.loginService.sendOtp(data).subscribe((result: any) => {
      this.load = false;
      if (result.status) {
        this.load = false;
        this.resetError();
        if (type == 1) {
          this.clearOTP()
          this.resendOTP(); 
          return
        }
        this.show_otp = true;
        this.showResend = true;
        const time = timer(1000);
        this.subscriptions.push(time.subscribe(() => {
          const input = this.getCodeBoxElement(1);
          input?.focus();
        }));
        this.toast.success(result.response.message, "")

        return
      }
      this.load = false;
      this.toast.warning(result.message, "")
    }))
  }

  loginUser() {
    const data: login_data = {
      "device_type": "1",
      "email": this.email,
      //this is edited by ali to change the login without encryption
      // "mobile_number": this.mobile_number,
      "password": this.loginService.encryptPassword(this.password),
      //"password": this.password,
      // "country_code": this.country_code
    }
    if (!this.show_password) {
      const otp = this.otp1 + this.otp2 + this.otp3 + this.otp4
      const post_data = {
        "email": this.email,
        // "country_code": this.country_code,
        "otp": otp,
      }
      this.loginWithOtp(post_data);
      return
    }
    this.subscriptions.push(this.loginService.userLogin(data).subscribe((result: any) => {
      if (result.response.token) {
        localStorage.setItem("logged_in", btoa("1"));
        localStorage.setItem("token", result.response.token);
        localStorage.setItem(btoa(btoa(("user_info_web"))), btoa(btoa(unescape(encodeURIComponent(JSON.stringify(result.response))))));
        this.shared.changeUserStatus(true);
        this.shared.changeUserData(result.response);
        // const user_profile={user_name:result.response.full_name,profile_image:result.response.profile_image  || "assets/images/icons/user-round.svg"}
        // this.shared.changeUserProfile(user_profile);
        this.load = false;
        localStorage.setItem("USERNAME",result.response.name);
        this.shared.setName(result.response.name);
        this.toast.success("Login Successfull! Welcome " + result.response.name, "");
        this.router.navigate(["/dashboard"])
        // this.router.navigate(["/add-kyc"],{queryParams:{type:btoa(btoa(result.response.role_type.toString()))}})
        return

      }
      this.load = false;
      this.toast.warning(result.response.message, "")
    }))
  }

  loginWithOtp(data: any) {
    this.subscriptions.push(this.loginService.loginWithOtp(data).subscribe((result: any) => {
      if (result.response.token) {
        localStorage.setItem("logged_in", btoa("1"));
        localStorage.setItem("token", result.response.token);
        localStorage.setItem(btoa(btoa(("user_info_web"))), btoa(btoa(unescape(encodeURIComponent(JSON.stringify(result.response))))));
        this.shared.changeUserStatus(true);
        this.shared.changeUserData(result.response);
        this.load = false;
        localStorage.setItem("USERNAME",result.response.name);
        this.toast.success("Login Successfull! Welcome " + result.response.name, "");
        if (result.response.kyc_approved_status == 1) {
          this.router.navigate(["/dashboard"])

          return
        }
        this.router.navigate(["/dashboard"])

        // this.router.navigate(["/add-kyc"],{queryParams:{type:btoa(btoa(result.response.role_type.toString()))}})
        return
      }
      this.load = false;
      this.clearOTP();
      this.toast.warning(result.response.message, "")
    }))
  }

  checkMobile(otp?: string) {
    this.load = true;
    let data = { "email": this.email }
    this.subscriptions.push(this.loginService.checkMobile(data).subscribe((result: any) => {
      if (!result.status) {
        this.loginUser();
        return
      }
      if (!result.response.status) {
        this.loginUser();
        return
      }
      if (this.show_password) {
        this.load = false;
        this.toast.warning("You are not registered with us. Please Login with Mobile Number", "")
        return
      }
      if (result.status) {
        if (otp) {
          this.verifyOtpPhp(otp)
        }
        return
      }
      this.toast.warning(result.response.message, "")
    }, (respagesError: any) => {
      this.load = false;
      const error = this.error.getError(respagesError);
      if (error == "Gateway timeout") {
        return
      }
      this.toast.error(error, "error")
    }));
  }

  verifyOtp() {
    if (this.load) return;
    this.err = false;
    this.resetError();
    const otp = this.otp1 + this.otp2 + this.otp3 + this.otp4
    if (otp.length != 4) {
      this.login_error.otp = true;
      this.err = true;
    }
    if (!this.err) {
      this.load = true;
      this.checkMobile(otp)
    }
  }

  verifyOtpPhp(otp: string) {
    const data = {
      "email": this.email,
      // "country_code": this.country_code,
      "otp": otp
    }
    this.subscriptions.push(this.loginService.verifyOtp(data).subscribe((result: any) => {
      if (result.status) {
        this.load = false;
        this.router.navigate(['/register'], { state: { email: this.email } })
        // this.openRegistrationModal(this.register_modal)
        return
      }
      this.load = false;
      this.clearOTP();
      this.toast.warning(result.response.message, "")
    }))
  }

  resendAgain() {
    this.showResend = false
    this.count += 1;
    if (this.count <= 3) {
      this.otpFromPhp(this.email, 1);
    } else {
      this.toast.warning("You exceeded maximum request attempts. Please try again after some time", "")
    }
  }

  resendOTP() {
    let timeleft = 30;
    this.downloadTimer = setInterval(() => {
      if (timeleft < 0) {
        this.document.getElementById("countdown")!.innerHTML = "";
        clearInterval(this.downloadTimer);
        this.showResend = true;
      } else {
        if (this.document.getElementById("countdown")) {
          this.document.getElementById("countdown")!.innerHTML = `<p>Wait for ${timeleft} seconds to resend</p>`;
        }
      }
      timeleft -= 1;
    }, 1000);
  }

  resetError() {
    this.login_error = {
      "email": false,
      "email_valid": false,
      "password": false,
      "password_valid": false,
      "otp": false,
    }
    // this.registration_error={
    //   "full_name":false,
    //   "email_id":false,
    //   "email_id_valid":false,
    //   "new_password":false,
    //   "new_password_valid":false,
    //   "confirm_password":false,
    //   "password_match":false,
    //   "confirm_password_valid":false,
    // }
  }

  clearOTP() {
    this.otp1 = "";
    this.otp2 = "";
    this.otp3 = "";
    this.otp4 = "";

  }

  getCodeBoxElement(index: number) {
    if (index === 1) {
      return this.getOtpReference("codeBox1")
    }
    if (index === 2) {
      return this.getOtpReference("codeBox2")
    }
    if (index === 3) {
      return this.getOtpReference("codeBox3")
    }
    if (index === 4) {
      return this.getOtpReference("codeBox4")
    }
    if (index === 5) {
      return this.getOtpReference("codeBox5")
    }
    if (index === 6) {
      return this.getOtpReference("codeBox6")
    }
    return
  }
  onKeyUpEvent(index: number, event: any) {
    const eventCode = event.which || event.keyCode;
    const id = `codeBox${index}`
    if (this.getOtpReference(id)!.value.length === 1) {
      if (index !== 6) {
        const next_id = `codeBox${index + 1}`
        this.getOtpReference(next_id)!.focus();
      } else {
        if (index == 6) {
          return
        }
        this.getOtpReference(id)!.blur();
      }
    }
    if (eventCode === 8 && index !== 1) {
      const prev_id = `codeBox${index - 1}`
      this.getOtpReference(prev_id).focus();
    }
  }

  onFocusEvent(index: number) {
    for (let item = 1; item < index; item++) {
      const id = `codeBox${item}`
      const currentElement = this.getOtpReference(id);
      if (currentElement) {
        currentElement.focus();
        break;
      }
    }
  }

  keyPressed(event: any, index: number) {
    let keycode = (event.which) ? event.which : event.keyCode;
    if ((keycode < 48 || keycode > 57) && keycode !== 13 || keycode == 46) {
      event.preventDefault();
      return false;
    }
    if (this.getOtpReference('codeBox1').value.length === 1 && index == 1) {
      return false;
    }
    if (this.getOtpReference('codeBox2').value.length === 1 && index == 2) {
      return false;
    }
    if (this.getOtpReference('codeBox3').value.length === 1 && index == 3) {
      return false;
    }
    if (this.getOtpReference('codeBox4').value.length === 1 && index == 4) {
      return false;
    }
    // if(this.getOtpReference('codeBox5').value.length===1 && index==5) {
    //   return false;
    // }
    // if(this.getOtpReference('codeBox6').value.length===1 && index==6) {
    //   return false;
    // }
    return
  }

  getOtpReference(id: any) {
    return this.document.getElementById(id) as HTMLInputElement
  }

  onlyNumbers(event: any) {
    var keycode = (event.which) ? event.which : event.keyCode;
    if ((keycode < 48 || keycode > 57) && keycode !== 13 || keycode == 46) {
      event.preventDefault();
      return false;
    }
    return
  }


  restrictAlphabets(e: any) {
    if (e.type == "paste") {
      var clipboardData = e.clipboardData;
      var pastedData = clipboardData.getData('Text');
      if (isNaN(pastedData)) {
        e.preventDefault();
      } else {
        return;
      }
    }
    var x = e.which || e.keycode;
    if ((x >= 48 && x <= 57))
      return true;
    else
      return false;
  }

}
