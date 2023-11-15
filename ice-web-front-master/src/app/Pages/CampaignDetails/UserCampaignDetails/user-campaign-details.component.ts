import { Component, OnInit } from '@angular/core';
import { StatementsService } from 'src/app/Shared/Services/statements.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/Shared/Services/shared.service';

@Component({
  templateUrl: './user-campaign-details.component.html',
  styleUrls: ['./user-campaign-details.component.css']
})
export class UserCampaignDetailsComponent implements OnInit {
  campaign_details:any={};
  subscriptions:Subscription[]=[];
  data_loaded:boolean=false;
  id:string="";
  LANG:any={};

  constructor(private statmentsService:StatementsService,private route:ActivatedRoute ,private shared:SharedService) {
    this.subscriptions.push(this.route.queryParams
      .subscribe(
        (params: Params) => {
          if(params['id']){
            this.id = atob(atob(params['id']));
            this.getUserCampaigns();
          }
        }
    ))
    this.subscriptions.push(this.shared.languageChange.subscribe((path:any)=>{
      this.changeLanguage();
    }))
    this.changeLanguage();
  }

  ngOnInit(): void {
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
  getUserCampaigns(){
    this.subscriptions.push(this.statmentsService.getUserCampaignDetails(this.id).subscribe((res:any)=>{
      this.campaign_details=res.response;
      this.data_loaded=true;
      //console.log(res)

    }))
  }


}
