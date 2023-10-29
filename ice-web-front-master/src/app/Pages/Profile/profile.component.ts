import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { environment } from 'src/environments/environment';
import { DashboardService } from '../Dashboard/dashboard.service';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';

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

  constructor(private shared: SharedService,public dashBoardService: DashboardService,public decryptAES:decryptAesService) {
    const user_data=btoa(btoa("user_info_web"));
    if(localStorage.getItem(user_data) != undefined){
      this.user_data=JSON.parse(atob(atob(localStorage.getItem(user_data) || '{}')));
    }
   
    this.subscriptions.push(this.shared.languageChange.subscribe((path: any) => {
      this.changeLanguage();
    }))
    this.changeLanguage();
    this.profile();
  }
  changeLanguage() {
    if (localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
      this.LANG = environment.arabic_translations;
    }
    else {
      this.LANG = environment.english_translations;
    }
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

  }



}
