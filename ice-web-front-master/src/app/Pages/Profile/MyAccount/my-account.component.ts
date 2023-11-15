import { Component, OnInit } from '@angular/core';
import { Toast, ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';
import { LkServiceService } from 'src/app/Shared/Services/lk-service.service';
import { LoginService } from 'src/app/Shared/Services/login.service';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  first_name:string="";
  last_name:string="";
  email:string="";
  mobile_number:string="";
  country_code: string="";
  subscriptions:Subscription[]=[]
  user_data:any={};
  old_password:any= ''
  new_password:any=''
  LANG:any={};

  constructor(private loginService:LoginService, public toast:ToastrService, lkService:LkServiceService,private shared:SharedService,public decryptAES:decryptAesService) {
    const user_data=btoa(btoa("user_info_web"));
    if(localStorage.getItem(user_data) != undefined){
      this.user_data=JSON.parse(atob(atob(localStorage.getItem(user_data) || '{}')));
    }
  
    this.subscriptions.push(this.shared.languageChange.subscribe((path:any)=>{
      this.changeLanguage();
    }))
    this.changeLanguage();
  }
  changeLanguage(){
    if (localStorage.getItem("arabic") == "true"  || localStorage.getItem("arabic") === null) {
        this.LANG=environment.arabic_translations;
    }
    else {
        this.LANG=environment.english_translations;
    }
    this.shared.getLang().subscribe(lang => {
      if(lang=='ar'){
        this.LANG = environment.arabic_translations;
      }
      else {
        this.LANG = environment.english_translations;
        
      }
    });
  }
  ngOnInit(): void {
    if(this.user_data.role_type == 2){
      this.getProfileDetails(1);
      return
    }
    this.getProfileDetails();
  }

  getProfileDetails(type?:number){
    const data={id:this.user_data.id}
    this.subscriptions.push(this.loginService.getProfileDetails(data,type).subscribe((res:any)=>{
      if(res.status){
        // this.first_name=res.response.name;
        this.first_name=res.response.first_name ;
        this.last_name=res.response.last_name;
        this.email=res.response.email;
        this.mobile_number=res.response.country_code+res.response.mobile_number;
      }

    }))

  }

  updateProfile(){
    let data = {
      'id':this.user_data.id,
      'email':this.email,
      'mobile_number':this.mobile_number
    }
    this.loginService.profileEdit(data).subscribe((res:any)=>{
      this.toast.success(res.response)
      this.ngOnInit()
    })
  }

  changePassword(){
    let data= {
      'id':this.user_data.id,
      'old_password':this.loginService.encryptPassword(this.old_password),
      'password':this.loginService.encryptPassword(this.new_password)
    }
    this.loginService.changePassword(data).subscribe((res:any)=>{
      this.toast.success(res.response)
      this.ngOnInit()
    })
  }

}
