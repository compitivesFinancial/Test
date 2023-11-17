import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/Shared/Services/login.service';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { environment } from 'src/environments/environment.prod';
import { DashboardService } from '../Dashboard/dashboard.service';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';

@Component({
  selector: 'app-sub-header-menue',
  templateUrl: './sub-header-menue.component.html',
  styleUrls: ['./sub-header-menue.component.css'],
})
export class SubHeaderMenueComponent implements OnInit {
  LANG: any = {};
  public profileDetails: any = '';
  subscriptions: Subscription[] = [];
  user_data: any = {};
  user_details: any = {};

  constructor(
    private loginService: LoginService,
    private shared: SharedService,
    public dashBoardService: DashboardService,public decryptAES:decryptAesService
  ) {
    // ------------------------------------------------------------------------------------//
    const user_data = btoa(btoa('user_info_web'));
    if (localStorage.getItem(user_data) != undefined) {
      this.user_data = JSON.parse(
        atob(atob(localStorage.getItem(user_data) || '{}'))
      );
    }
  
    // ------------------------------------------------------------------------------------//
    this.subscriptions.push(
      this.shared.languageChange.subscribe((path: any) => {
        this.changeLanguage();
      })
    );
    // ------------------------------------------------------------------------------------//
    this.profile();
  }

  ngOnInit(): void {}
  /*****************************************************************************************/
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
  /*****************************************************************************************/
  // getProfileDetails(type?: number) {
  //   const data = { id: this.user_data.id };
  //   this.subscriptions.push(
  //     this.loginService.getProfileDetails(data, type).subscribe((res: any) => {
  //       if (res.status) {
  //         this.user_details = res.response;
  //         // if (res.response.kyc_approved_status == 1) {
  //         //   this.disabled_inputs = true;
  //         // }
  //       }
  //     })
  //   );
  // }
  profile() {
    let data = {
      id: this.user_data.id,
    };
    this.dashBoardService.profileDetails(data).subscribe((res: any) => {
      this.profileDetails = res.response;
     // console.log(this.profileDetails);
    });
  }
}
