import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CampaignService } from 'src/app/Shared/Services/campaign.service';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';
import { LoginService } from 'src/app/Shared/Services/login.service';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { environment } from 'src/environments/environment';
declare const $:any
@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.css']
})
export class CampaignDetailsComponent implements OnInit {
  subscriptions:Subscription[]=[];
  id!:string;
  campaign_details:any={};
  main_image!:string;
  amount!:string;
  load:boolean=false;
  user_data:any={};
  user_details:any={};
  LANG:any={}
  disabled_inputs: boolean = false;

  constructor(private route:ActivatedRoute,private campaignService:CampaignService,private loginService:LoginService,private toast:ToastrService,private router:Router,private shared:SharedService,private decryptAES:decryptAesService) {
    const user_data=btoa(btoa("user_info_web"));
    if(localStorage.getItem(user_data) != undefined){
      this.user_data=JSON.parse(atob(atob(localStorage.getItem(user_data) || '{}')));
    }
   
    this.subscriptions.push(this.route.queryParams
      .subscribe(
        (params: Params) => {
          if(params['campaign_id']){
            this.id = atob(atob(params['campaign_id']));
            this.getCampaignDetails();
          }
        }
    ))
    this.subscriptions.push(this.shared.languageChange.subscribe((path:any)=>{
      this.changeLanguage();
    }))
    this.changeLanguage();
   }
   changeLanguage(){
    if(localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
        this.LANG=environment.arabic_translations;
    }
    else {
        this.LANG=environment.english_translations;
    }
  }
  ngOnInit(): void {
    this.getProfileDetails();
  }

  getCampaignDetails(){
    this.subscriptions.push(this.campaignService.getCampaignDetails(this.id).subscribe((res:any)=>{
      if(res){
        this.campaign_details=res.response;
        if(this.campaign_details && this.campaign_details?.campaign_images?.length > 0){
          this.main_image=this.campaign_details?.campaign_images[0]?.image;
        }
      }
    }))
  }

  invest(){
    if(!this.amount){
      this.toast.warning("Please enter amount to invest.");
      return
    }
    this.load=true;
    const data={
      "amount": this.amount,
      "campaign_id": this.campaign_details?.id,
      "user_id": this.user_data.id
    }

    this.subscriptions.push(this.campaignService.invest(data).subscribe((res:any)=>{
      this.load=false;
      if(res.status){
        this.toast.success("Thank you for investing!")
        $("#invest").modal("hide");
        return
      }
      this.toast.warning(res.response.message);
    }))
  }

  openInvestModal(){
    this.amount=""
    if(this.user_details?.kyc_approved_status == 1){
      $("#invest").modal("show")
      return
    }
    this.router.navigate(["/add-kyc"])
  }

  getProfileDetails(){
    const data={id:this.user_data.id}
    this.subscriptions.push(this.loginService.getProfileDetails(data).subscribe((res:any)=>{
      if(res.status){
          this.user_details=res.response
      }
      if (res.response.kyc_approved_status == 1) {
        this.disabled_inputs = true;
      }
    }))

  }

}
