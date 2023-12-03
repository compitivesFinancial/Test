import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { CampaignService } from 'src/app/Shared/Services/campaign.service';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { StatementsService } from 'src/app/Shared/Services/statements.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.css']
})


export class CampaignListComponent implements OnInit,OnDestroy {
  campaign_list:any=[];
  campaign_list_image:any=[];
  subscriptions:Subscription[]=[];
  data_loaded:boolean=false;
  user_data:any={};
  type:number=1;
  LANG:any={};
  startDate: any=new Date();
  closedDates: any[]=[];
  timeDiff: any[]=[];
  intervalSubscription: Subscription = new Subscription();
  constructor(private campaignService:CampaignService,private router:Router,private statmentsService:StatementsService,private shared:SharedService,public decryptAES:decryptAesService) {
    const user_data=btoa(btoa("user_info_web"));
    if(localStorage.getItem(user_data) != undefined){
      this.user_data=JSON.parse(atob(atob(localStorage.getItem(user_data) || '{}')));
    }
   
   
    this.changeLanguage();
  }

  ngOnInit(): void {

    this.getcampaigns();
    this.timeDiff=this.calculateTimeDifference(this.timeDiff);
    
  }
  changeLanguage(){
   
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
        this.campaign_list_image= res.response.campaign_image;
        this.startDate=new Date();
        for(let i=0;i<this.campaign_list.length;i++){
          if(this.campaign_list[i].open_date!==null&&this.campaign_list[i].close_date&&this.campaign_list[i].close_date!==null&&this.campaign_list[i].open_date){
            
            let closeDate = new Date(this.campaign_list[i].close_date);
            let openDate = new Date(this.campaign_list[i].open_date);
            if(openDate.getTime()<closeDate.getTime()){
              if(closeDate>this.startDate && openDate < this.startDate){
                this.timeDiff.push({type:"closedDate",firstDate:closeDate.getTime()});
              }
              else if(openDate>this.startDate && closeDate>this.startDate){
                this.timeDiff.push({type:"openedDate",firstDate:openDate.getTime()});
              }
              else {
                this.timeDiff.push({type:"outDated",firstDate:"This opprotunity is Closed"});
              }
            }
            else {
              this.timeDiff.push({type:"nullTime",firstDate:null});
            }
          }
          else {
            this.timeDiff.push({type:"nullTime",firstDate:null});
          }
        }
        this.timeDiff=this.calculateTimeDifference(this.timeDiff);
      }
    }))
  }
  calculateTimeDifference(times:any) {
    this.startDate=new Date();
    for(let i=0;i<times.length;i++){
    if(times[i].firstDate!==null){
      let days = Math.floor((times[i].firstDate-this.startDate) / (1000 * 60 * 60 * 24));
      let hours = Math.floor(((times[i].firstDate-this.startDate) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor(((times[i].firstDate-this.startDate) % (1000 * 60 * 60)) / (1000 * 60));
      times[i].days=days;
      times[i].hours=hours;
      times[i].minutes=minutes;
      times[i].timeString="";
    }
    else if(times[i].firstDate==="This opprotunity is Closed")
    {
      times[i].timeString="This opprotunity is Closed";
    }
    else {
      times[i].timeString="Period not defined Yet";
    }
    }
    return times;
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

  navTo(list:any,counterData:any){
    // console.log('outer')
    if(list!= null ){
      // console.log('iner')
      // console.log(this.router);
    this.shared.setOpportunity(list,counterData);
      this.router.navigateByUrl(`/dashboard/${btoa(list.id)}`);
    }
  }
  ngOnDestroy() {
  }
}
