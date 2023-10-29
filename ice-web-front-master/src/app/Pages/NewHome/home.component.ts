import { Component, OnInit } from '@angular/core';
import { CampaignService } from 'src/app/Shared/Services/campaign.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { errorHandlerService } from 'src/app/Shared/Services/errorHandler.service';
import { Router } from '@angular/router';
declare const $:any;
declare const WOW:any;
@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class NewHomeComponent implements OnInit {
  product_list:any=[];
  subscriptions:Subscription[]=[];
  LANG:any={};
  first_name:string="";
  last_name:string="";
  email:string="";
  mobile_number:string="";
  message:string="";
  form_error:any={};
  load:boolean=false;
  err:boolean=false;
  home_data:any={};
  home_page:any={};
  investmentOppertunityList:any
  public upcomingInvestmentOppertunityList:any

  constructor(private campaignService:CampaignService,private shared:SharedService,private toast:ToastrService,private error:errorHandlerService, public router:Router) {
    this.subscriptions.push(this.shared.languageChange.subscribe((path:any)=>{
      this.changeLanguage();
      // this.getProducts();
      this.getHomeData();
      // this.getHomePage();

    }))
    this.changeLanguage();
  }

  ngOnInit(): void {
    // this.getProducts();
    this.getHomeData();
    new WOW().init();
    this.investMentOppertunity()
    this.upcomingInvestmentOppertunity()


    $("#carousel-1").owlCarousel({
      margin:30,
      loop: false,
      autoplay: false,
      dots: false,
      nav: false,
      responsive: {
          0: {
              items: 1.4,
          },
          600: {
              items: 1.4,
          },
          1000: {
              items: 3.8,
          },
      }
  });
  $("#carousel-2").owlCarousel({
    margin:30,
    loop: false,
    autoplay: false,
    dots: false,
    nav: false,
    responsive: {
        0: {
            items: 1.4,
        },
        600: {
            items: 1.4,
        },
        1000: {
            items: 3.8,
        },
    }
});
$("#carousel-3").owlCarousel({
  margin:30,
  loop: false,
  autoplay: false,
  dots: false,
  nav: false,
  responsive: {
      0: {
          items: 1.4,
      },
      600: {
          items: 1.4,
      },
      1000: {
          items: 2.8,
      },
  }
});

    // this.getHomePage();
  }

  getProducts(){
    this.subscriptions.push(this.campaignService.getProductList().subscribe((res:any)=>{
      if(res){
        this.product_list=res.response;
        this.product_list=this.product_list.filter((item:any)=>{
          return item.product_attribute_detail.length > 0 && item.product_attribute_detail.length <= 15
        })
        this.product_list=this.product_list.splice(0,4)

      }
    }))
  }

  // getHomePage(){
  //   this.subscriptions.push(this.campaignService.getHomePage().subscribe((res:any)=>{
  //     if(res){
  //       this.home_page=res.response;
  //     }
  //   }))
  // }

  getHomeData(){
    this.subscriptions.push(this.campaignService.getHomeData().subscribe((res:any)=>{
      if(res){
        this.home_data=res.response;
      }
    }))
  }


  goToLogin(type:string){
    this.router.navigate(["/register"],{ queryParams: { type: btoa(btoa(type))}})
    // this.close();
  }
  public namechange:boolean=false

  changeLanguage(){
    if(localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {

        this.LANG=environment.arabic_translations;
        this.namechange = true
    }
    else {
        this.LANG=environment.english_translations;
        this.namechange = false
    }
  }

  errorHandler(){
    this.err=false;
    if(this.first_name == "" || this.first_name == undefined){
        this.form_error.first_name=true;
        this.err=true;
    }

    if(this.last_name == "" || this.last_name == undefined){
      this.form_error.last_name=true;
      this.err=true;
  }
  this.mobileErrorHandler();

    if(this.email == "" || this.email == undefined){
      this.form_error.email_id=true;
      this.err=true;
    }

    if(this.message == "" || this.message == undefined){
      this.form_error.message=true;
      this.err=true;
    }

    if(!this.form_error.email_id && this.checkEmail(this.email)){
      this.form_error.email_id_valid=true;
      this.err=true;
    }

  }

  checkEmail(email:string){
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !re.test(email)
  }

   mobileErrorHandler(){
    if(this.mobile_number == ""  || this.mobile_number == undefined){
      this.form_error.mobile_number=true;
      this.err=true;
    }
    if(this.form_error.mobile_number == false && this.mobile_number.length != 10){
      this.form_error.mobile_number_valid=true;
      this.err=true;
    }
  }

  submit(){
    this.resetError();
    this.errorHandler();
    if(this.err) return;
    this.load=true;
    const data={
      "first_name":this.first_name,
      "last_name":this.last_name,
      "email":this.email,
      "mobile":this.mobile_number,
       "message":this.message
     }

     this.subscriptions.push(this.campaignService.contactUs(data).subscribe((result:any)=>{
      this.load=false;
      if(result.status){
          this.toast.success(result.response.message,"");
          this.message="";
          this.first_name="";
          this.last_name="";
          this.mobile_number="";
          this.email="";
          // this.router.navigate(["/add-kyc"],{queryParams:{type:btoa(btoa(result.response.role_type.toString()))}})

          return
      }
      this.toast.warning(result.response.message,"")

    },respagesError => {
      this.load=false;
      const error = this.error.getError(respagesError);
      if(error == "Gateway timeout"){
        return
      }
      this.toast.error(error,"Error")
    }));
  }

  resetError(){
    this.form_error={
      "first_name":false,
      "last_name":false,
      "email_id":false,
      "email_id_valid":false,
      "mobile_number":false,
      "mobile_number_valid":false,
      "message":false,
    }
  }

  onlyNumbers(event:any){
    var keycode = (event.which) ? event.which : event.keyCode;
    if ((keycode < 48 || keycode > 57) && keycode !== 13 || keycode == 46) {
      event.preventDefault();
      return false;
    }
    return
  }

  investMentOppertunity(){
    this.campaignService.investmentOppertunityQaysar().subscribe((res:any)=>{
      this.investmentOppertunityList =res.response
      // console.log(this.investmentOppertunityList);

    })
  }

  upcomingInvestmentOppertunity(){
    this.campaignService.upcomingInvesmentOppertunity().subscribe((res:any)=>{
      this.upcomingInvestmentOppertunityList = res.response
      // console.log(this.upcomingInvestmentOppertunityList);


    })
  }

  navTo(list:any){
    // console.log('outer')
    if(list!= null ){
      // console.log('iner')
      // console.log(this.router);

      this.router.navigateByUrl(`/dashboard/${btoa(list.id)}`)
    }
  }

  percantageInvestment(a:any,b:any){
    return(`${(a/b)*100}`)
  }

}
