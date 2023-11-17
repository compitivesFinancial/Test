import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { environment } from 'src/environments/environment.prod';
import { DashboardService } from '../Dashboard/dashboard.service';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';
import { LoginService } from 'src/app/Shared/Services/login.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  subscriptions: Subscription[] = [];
  user_data:any={};
  LANG: any = {};
  public profileDetails: any  = ''
  disabled_inputs: boolean=false;

  constructor(private shared: SharedService,public dashBoardService: DashboardService,public decryptAES:decryptAesService,  private loginService: LoginService) {
    const user_data=btoa(btoa("user_info_web"));
    if(localStorage.getItem(user_data) != undefined){
      this.user_data=JSON.parse(atob(atob(localStorage.getItem(user_data) || '{}')));
    }
   
   
    this.changeLanguage();
    this.profile();
  }
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
  profile() {
    let data = {
      'id': this.user_data.id
    }
    this.dashBoardService.profileDetails(data).subscribe((res: any) => {
      this.profileDetails = res.response
     // console.log(this.profileDetails);

    })
  }
  ngOnInit(): void {
    const data = { id: this.user_data.id };
    this.loginService.getProfileDetails(data, undefined).subscribe((res: any) => {
      if (res.response.kyc_approved_status == 1) {
        this.disabled_inputs = true;
      }
    })
  }



}
