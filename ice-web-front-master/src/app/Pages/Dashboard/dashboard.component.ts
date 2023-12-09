import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/Shared/Services/login.service';
import { Subscription, timer } from 'rxjs';
import { CampaignService } from 'src/app/Shared/Services/campaign.service';
import { environment } from 'src/environments/environment.prod';
import { type } from 'os';
import { DashboardService } from './dashboard.service';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { DocumentService } from 'src/app/Shared/Services/document.service';
import { CampaginWithKyc } from 'src/app/Shared/Models/campagin-with-kyc';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { SettingService } from '../setting/setting.service';
import { BankapiService } from 'src/app/Shared/Services/bankapi.service';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';
import { DOCUMENT } from '@angular/common';
import jsPDF from 'jspdf';
import { errorHandlerService } from 'src/app/Shared/Services/errorHandler.service';
import { CircleProgressOptions } from 'ng-circle-progress';
// import { Toast } from 'ngx-toastr';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;
  errors: any = {};
  user_info: any = {};
  user_data: any = {};
  dashboard_data: any = {};
  subscriptions: Subscription[] = [];
  LANG: any = {};
  public opertunityDetailList: any;
  requestId: any;
  public teams: any;
  public campaign_images: any;
  public amountForm: FormGroup;
  public cardDetailsForm: any;
  public campaignAttachements: any = '';
  public totalInvest: any = '';
  public campaignCount: any = '';
  campaginWithKyc!: CampaginWithKyc;
  kycStatus: any;
  myDate: any;
  disabled_inputs: boolean = false;
  investPercentage: any;
  walletInvestorSum :any;
  checkedBtn:boolean=false;
  printPage:any;
  load: boolean = false;
  login_error: any = {};
  otp1: string = "";
  otp2: string = "";
  otp3: string = "";
  otp4: string = "";
  email: any = "";
  err: boolean = false;
  password: string = "";
  show_otp: boolean=false;
  showResend: boolean = false;
  count: number = 0;
  downloadTimer: any;
  verifyClick:boolean=true;
  opportunityData:any;
  closeInvest:boolean=false;
  opportunityInvestorData: any;
  loading: boolean=true;
  options = new CircleProgressOptions();
  options1 = new CircleProgressOptions();
  options2 = new CircleProgressOptions();
  dontShowTime: boolean=false;
  loading2: boolean=true;
  netAmount:any=0;
  emailaddon: any;
  investorAllowance:boolean=false;
  constructor(
    public setingservice: SettingService,
    private datePipe: DatePipe,
    private loginService: LoginService,
    private campaignService: CampaignService,
    public dashboardService: DashboardService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public router: Router,
    private toast: ToastrService,
    private documentService: DocumentService,
    private bankapiService: BankapiService,
    private shared: SharedService,public decryptAES:decryptAesService, @Inject(DOCUMENT) private document: Document, private error: errorHandlerService
  ) {
    this.myDate = new Date();
    this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    const user_data = btoa(btoa('user_info_web'));
    if (localStorage.getItem(user_data) != undefined) {
      this.user_data = JSON.parse(
        atob(atob(localStorage.getItem(user_data) || '{}'))
      );
    }

    this.cardDetailsForm = this.formBuilder.group({
      cardNumber: ['', Validators.required],
      carddate: ['', Validators.required],
    });
   
    this.changeLanguage();
    this.getWalletInvestorSum();
    this.amountForm = this.formBuilder.group({
      amount: ['', [Validators.required,Validators.min(1000),Validators.max(20000)]],
      agreement: ['', Validators.required],
    });
  }
  
  async getWalletInvestorSum() {
    await this.setingservice.walletInvestorSum().subscribe((res: any) => {
      this.walletInvestorSum = res.response;
    });
  }
  makePdf(tab:string){
      var prtContent = document.getElementById(tab);
      var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
      if(!!WinPrint && !!prtContent) {
      var totalContent='';
      totalContent+="<div style='text-align:right;display:flex;flex-direction:column;justify-content:center'>"
      +"<img src='https://firebasestorage.googleapis.com/v0/b/royal-stallion.appspot.com/o/Kyc%2Fmain-logo1.png1675837471662?alt=media&token=32bbfe33-003e-4d47-9931-0e06d237183d' alt='broken image' style='margin:0 auto' width='195' height='78'>"
      +prtContent.innerHTML+
      "</div>"
        WinPrint.document.write(totalContent);
        WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();
      }
     
    }
  ngOnInit(): void {
    this.options.innerStrokeColor="#0d6efd99"
    this.options.outerStrokeColor="#0d6efd"
    this.options.showUnits=true;
    this.options.radius=77;
    this.options.outerStrokeWidth=10;
    this.options.titleFontSize='37';
    this.options.subtitleFontSize='37';
    this.options.unitsFontSize='20';
    this.options.showSubtitle=false;
    this.options.subtitle="Days";
    this.options.units="Days";
    this.options.percent=0;
    this.options.maxPercent=365;

    this.options1.innerStrokeColor="#0d6efd99"
    this.options1.outerStrokeColor="#0d6efd"
    this.options1.showUnits=true;
    this.options1.radius=77;
    this.options1.outerStrokeWidth=10;
    this.options1.titleFontSize='37';
    this.options1.subtitleFontSize='37';
    this.options1.unitsFontSize='20';
    this.options1.showSubtitle=false;
    this.options1.subtitle="Hours";
    this.options1.units="Hours";
    this.options1.percent=0;
    this.options1.maxPercent=24;

    this.options2.innerStrokeColor="#0d6efd99"
    this.options2.outerStrokeColor="#0d6efd"
    this.options2.showUnits=true;
    this.options2.radius=77;
    this.options2.outerStrokeWidth=10;
    this.options2.titleFontSize='37';
    this.options2.subtitleFontSize='37';
    this.options2.unitsFontSize='20';
    this.options2.showSubtitle=false;
    this.options2.subtitle="Minutes";
    this.options2.units="Minutes";
    this.options2.percent=0;
    this.options2.maxPercent=60;
    if (this.user_data.role_type == 2) {
      this.getProfileDetails(1);
      this.getDashboardDetails(1);
      this.requestId = atob(this.route.snapshot.params['id']);
      if (this.requestId != null) {
        this.getOpertunityDetails(1);
        this.getCampaignAttachments();
      }
      this.getCheckInvestorRole();
      this.getOpertunityComPercentage();
      return;
    }
    this.getProfileDetails();
    this.getDashboardDetails();

    this.requestId = atob(this.route.snapshot.params['id']);
    if (this.requestId != null) {
      this.getOpertunityDetails();
    }
    this.getCheckInvestorRole();
    this.getCampaignAttachments();
    this.getOpertunityComPercentage();
  }
  /***********************************************************************************/

  getSukukDetails() {
    if (this.opertunityDetailList == undefined) {
      this.getOpertunityDetails();
    }
    this.subscriptions.push(
      this.documentService
        .getSukukDetails(
          this.opertunityDetailList.user_id,
          this.opertunityDetailList.id
        )
        .subscribe((res: any) => {
          this.kycStatus = res.status;
          if (res.status) {
            this.campaginWithKyc = res.response;
          }
        })
    );
  }
  /***********************************************************************************/
  changeLanguage() {
    this.shared.getLang().subscribe((lang:any) => {
      if(lang=='ar'){
        this.LANG = environment.arabic_translations;
      }
      else {
        this.LANG = environment.english_translations;
        
      }
    });
  }

  getProfileDetails(type?: number) {
    const data = { id: this.user_data.id };
    this.subscriptions.push(
      this.loginService.getProfileDetails(data, type).subscribe((res: any) => {
        if (res.status) {
          this.user_info = res.response;
        }
        if (res.response.kyc_approved_status == 1) {
          this.disabled_inputs = true;
        }
      })
    );
  }

  getDashboardDetails(type?: number) {
    const data = { user_id: this.user_data.id };
    this.subscriptions.push(
      this.campaignService
        .investorDashboard(data, type)
        .subscribe((res: any) => {
          this.dashboard_data = res.response.data;
        })
    );
  }
  getOpportunityData(){
    this.getOpertunityComPercentage();
    this.shared.getOpportunity().subscribe((data:any)=>{
      if(data.data.days!==null&&data.data.hours!==null&&data.data.minutes!==null){
        this.options.percent=data.data.days;
        this.options1.percent=data.data.hours;
        this.options2.percent=data.data.minutes;
        this.loading2=false;
      }
      else {
        this.dontShowTime=true;
      }
      this.dashboardService
      .getCampaignInvestPerc(this.requestId)
      .subscribe((res: any) => {
        if(res.status){
          // Math.round((res.response + Number.EPSILON) * 100) / 100
          this.investPercentage = (Math.round((res.response.percent + Number.EPSILON) * 100) / 100);
          if(!!data && !!this.investPercentage){
            this.opportunityData=data.opp; 
            
            
            
            if(this.opportunityData.open_date!==null && !!this.investPercentage && this.opportunityData.close_date!==null&& this.opportunityData.close_date && this.opportunityData.open_date){
              const current =new Date();
              const openDate = new Date(this.opportunityData.open_date);
              const closeDate = new Date(this.opportunityData.close_date);
              if(openDate>current||this.investPercentage>100||closeDate<=current){
                this.closeInvest=true;
              }
            }
            else {
              this.closeInvest=true;
            }
           
          }
        }
       
      })
     
     
    });
  }
  getOpertunityComPercentage() {
    this.subscriptions.push(
      this.dashboardService
        .getCampaignInvestPerc(this.requestId)
        .subscribe((res: any) => {
          if(res.status){
            this.loading=false;
            this.opportunityInvestorData=res.response;

            this.investPercentage = (Math.round((res.response.percent + Number.EPSILON) * 100) / 100);
            
          }
         
        })
    );
  }

  getOpertunityDetails(type?: number) {
    this.subscriptions.push(
      this.dashboardService
        .opertunityDetails(this.requestId)
        .subscribe((res: any) => {
          this.getOpportunityData();
          this.opertunityDetailList = res.response.campaign;
          
            this.dashboardService
            .getCampaignInvestPerc(this.requestId)
            .subscribe((res: any) => {
              if(res.status){
                this.loading=false;
                this.opportunityInvestorData=res.response;
                this.dashboardService.investmentsCount().subscribe((res:any)=>{
                  if(res){
                    this.investorAllowance=res.status;
                   
                  } 
                });
                this.netAmount=this.opertunityDetailList.total_valuation-this.opportunityInvestorData.amount;
                if(this.user_data.isQualified){
                  this.amountForm.get('amount')?.setValidators([Validators.required,Validators.min(1000),Validators.max(this.netAmount)]);
              }
              else if(this.netAmount>=this.opertunityDetailList.max_investment && !this.user_data.isQualified){
                this.amountForm.get('amount')?.setValidators([Validators.required,Validators.min(1000),Validators.max(this.opertunityDetailList.max_investment)]);
              }
              else {
                this.amountForm.get('amount')?.setValidators([Validators.required,Validators.min(1000),Validators.max(this.netAmount)]);
              }
            }
            })
          this.teams = res.response.campaign.team;
          this.campaign_images = res.response.campaign.campaign_images;
          this.campaignService.campaignDetail = res.response.campaign;
        })
    );
  }

  onPaydetails: any;

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
  verifyOtpPhp(otp: string) {
    const data = {
      "email": this.email,
      // "country_code": this.country_code,
      "otp": otp
    }
    this.subscriptions.push(this.loginService.verifyOtp(data).subscribe((result: any) => {
      if (result.status) {
        this.load = false;
        this.onPay();
        return
      }
      this.load = false;
      this.clearOTP();
      this.toast.warning(result.response.message, "")
    }))
  }
  loginUser() {
      const otp = this.otp1 + this.otp2 + this.otp3 + this.otp4
      const post_data = {
        "email": this.email,
        // "country_code": this.country_code,
        "otp": otp,
      }
      this.loginWithOtp(post_data);
    
  }
  loginWithOtp(data: any) {
    this.subscriptions.push(this.loginService.loginWithOtp(data).subscribe((result: any) => {
      if (result.response.token) {
        this.onPay();
        this.load = false;
       
        return
      }
      this.load = false;
      this.clearOTP();
      this.toast.warning(result.response.message, "")
    }))
  }
  sendOTP() {
    if(!!localStorage.getItem("emailLogin")){
      this.email=localStorage.getItem("emailLogin");
      this.emailaddon=this.email;
    }
    this.emailaddon=this.email; 
    this.otpFromPhp(this.email);
    if (this.load) return;
    this.err = false;
    this.resetError();
    this.errorHandler();
    if (!this.err) {
      this.load = true;
      // this.otpFromPhp(this.mobile_number);
  
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
  clearOTP() {
    this.otp1 = "";
    this.otp2 = "";
    this.otp3 = "";
    this.otp4 = "";

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
  resetError() {
    this.login_error = {
      "email": false,
      "email_valid": false,
      "password": false,
      "password_valid": false,
      "otp": false,
    }
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
    return
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
  }
  checkEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !re.test(email)
  }
  getOtpReference(id: any) {
    return this.document.getElementById(id) as HTMLInputElement
  }
  onPay() {
    this.verifyClick=false;
    if (this.amountForm.valid) {
      if (
        this.amountForm.value.agreement == undefined ||
        this.amountForm.value.agreement == false
      ) {
        this.errors.agreement = true;
        this.errors.amount = false;
        return;
      } else {
        this.errors.agreement = false;
      }

      if(!this.user_data.isQualified){
        const totalInvestment = Number(this.amountForm.value.amount) + Number(this.totalInvest);
        if(this.amountForm.value.amount <1000){
          this.toast.error("You are not allowed to invest less than 1000 SR");
          return;
        }
        if(totalInvestment > 20000){
          this.toast.error("You are not allowed to invest over 20000 SR");
          return;
        }
        if(this.campaignCount >=2){
          this.toast.error("you are already invest in 2 opportunity in the last 12 month");
          return;
        }
        if(this.walletInvestorSum.walletBalance<this.amountForm.value.amount){
          this.toast.error("you don't have enough money in your wallet");
          return;
        }
        
      }

      let data = {
        amount: this.amountForm.value.amount,
        invester: `${this.user_data.id}`,
        campaign: this.requestId,
      };
      this.errors.amount = false;
      this.closebutton.nativeElement.click();
      this.dashboardService.onPay(data).subscribe((res: any) => { 
         if(res.response.status){
          this.onPaydetails = res.response.session_id;
          this.toast.success(res.response.message);
        }
        else {
          this.toast.warning(res.response.message);
        }
        
      });
      this.getOpertunityDetails();
      this.bankapiService.payment(this.amountForm.value.amount).subscribe((res: any) => {

      });
      this.amountForm.value.amount = '';
    } else {
      if (
        this.amountForm.value.agreement == undefined ||
        this.amountForm.value.agreement == false
      ) {
        this.errors.agreement = true;
      } else {
        this.errors.agreement = false;
      }
      if (
        this.amountForm.value.amount == undefined ||
        this.amountForm.value.amount == null ||
        this.amountForm.value.amount == ''
      ) {
        this.errors.amount = true;
      } else {
        this.errors.amount = false;
      }
    }
  }

  public PaymentSession: any;
  pay() {
    this.PaymentSession.updateSessionFromForm('card');
  }

  details() {
    this.PaymentSession.configure({
      session: this.onPaydetails,
      fields: {
        card: {
          number: '#card-number',
          securityCode: '#security-code',
          expiryMonth: '#expiry-month',
          expiryYear: '#expiry-year',
          nameOnCard: '#cardholder-name',
        },
      },
      frameEmbeddingMitigation: ['javascript'],
      callbacks: {
     
        
      },
      interaction: {
        displayControl: {
          formatCard: 'EMBOSSED',
          invalidFieldCharacters: 'REJECT',
        },
      },
    });
  }

  getCampaignAttachments() {
    this.subscriptions.push(
      this.campaignService
        .getCampainAttachement(this.requestId)
        .subscribe((res: any) => {
          this.campaignAttachements = res.response;
        })
    );
  }

  async getCheckInvestorRole() {
   await this.subscriptions.push(
      this.campaignService
        .checkInvestorRole()
        .subscribe((res: any) => {
          this.totalInvest = res.response.total_invest;
          this.campaignCount= res.response.campaignCount;
        })
    );
  }
  onlyNumbers(event: any) {
    var keycode = event.which ? event.which : event.keyCode;
    if (((keycode < 48 || keycode > 57) && keycode !== 13) || keycode == 46) {
      event.preventDefault();
      return false;
    }
    return;
  }
}
