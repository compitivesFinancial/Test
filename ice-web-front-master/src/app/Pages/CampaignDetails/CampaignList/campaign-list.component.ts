import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CampaignService } from 'src/app/Shared/Services/campaign.service';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { StatementsService } from 'src/app/Shared/Services/statements.service';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.css']
})


export class CampaignListComponent implements OnInit {
  campaign_list:any=[];
  campaign_list_image:any=[];
  subscriptions:Subscription[]=[];
  data_loaded:boolean=false;
  user_data:any={};
  type:number=1;
  LANG:any={};


  constructor(private campaignService:CampaignService,private router:Router,private statmentsService:StatementsService,private shared:SharedService,public decryptAES:decryptAesService) {
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

    this.getcampaigns();
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
  getcampaigns(user_id?:number){
    this.subscriptions.push(this.campaignService.getCampaignList(user_id).subscribe((res:any)=>{
      if(res){
        this.campaign_list=res.response;
        this.data_loaded=true;
        this.campaign_list_image= res.response.campaign_image

      }
    }))
  }

  goToDetails(data:any){
    if(this.type == 1){
      this.router.navigate(['/campaign-details'],{ queryParams: { campaign_id: btoa(btoa(data.id))}})
      return
    }
    this.router.navigate(["/profit"],{queryParams:{id:btoa(btoa(data.id))}})
  }

  getUserCampaigns(){
    this.subscriptions.push(this.statmentsService.getUserCampaigns(this.user_data.id).subscribe((res:any)=>{
      this.campaign_list=res.response;
      this.data_loaded=true;

    }))
  }



  changeTabs(type:number){
    this.type=type;
    this.data_loaded=false;
    this.campaign_list=[];
    if(type == 1){
      if(this.user_data.role_type == 3){
        this.getcampaigns(this.user_data.id);
        return
      }
      this.getcampaigns();
      return
    }
    if(type == 2){
      this.getUserCampaigns();
      return
    }
    setTimeout(() => {
      this.data_loaded=true;
    }, 2000);
  }

  navTo(list:any){
    // console.log('outer')
    if(list!= null ){
      // console.log('iner')
      // console.log(this.router);

      this.router.navigateByUrl(`/dashboard/${btoa(list.id)}`)
    }
  }

}
