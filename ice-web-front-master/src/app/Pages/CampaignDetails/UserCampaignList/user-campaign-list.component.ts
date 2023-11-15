import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { StatementsService } from 'src/app/Shared/Services/statements.service';
import { environment } from 'src/environments/environment';
declare const $:any;
@Component({
  selector: 'app-user-campaign-list',
  templateUrl: './user-campaign-list.component.html',
  styleUrls: ['./user-campaign-list.component.css']
})
export class UserCampaignListComponent implements OnInit {

  campaign_list:any=[];
  subscriptions:Subscription[]=[];
  user_data:any={};
  data_loaded:boolean=false;
  LANG:any={};


  constructor(private statmentsService:StatementsService,private router:Router ,private shared:SharedService,public decryptAES:decryptAesService) {
    const user_data=btoa(btoa("user_info_web"));
    if(localStorage.getItem(user_data) != undefined){
      this.user_data=JSON.parse(atob(atob(localStorage.getItem(user_data) || '{}')));
    }
  
    this.subscriptions.push(this.shared.languageChange.subscribe((path:any)=>{
      this.changeLanguage();
    }))
    this.changeLanguage();
  }

  ngOnInit(): void {
    this.getUserCampaigns()
  }
  changeLanguage(){
    if(localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
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
  getUserCampaigns(){
    this.subscriptions.push(this.statmentsService.getUserCampaigns(this.user_data.id).subscribe((res:any)=>{
      this.campaign_list=res.response;
      this.data_loaded=true;
     // console.log(res)
      setTimeout(() => {
        $('#borrowers').DataTable({
          ordering: false,
          responsive: true,

        });
      }, 100);
    }))
  }

  view(data:any){
    this.router.navigate(["/user-campaign-details"],{queryParams:{id:btoa(btoa(data.id))}})
    // this.router.navigate(["/profit"],{queryParams:{id:btoa(btoa(data.id))}})
  }

}
