import { Component, OnInit } from '@angular/core';
import { CampaignService } from 'src/app/Shared/Services/campaign.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/Shared/Services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  product_list:any=[];
  subscriptions:Subscription[]=[];
  LANG:any={};

  constructor(private campaignService:CampaignService,private shared:SharedService) { 
    this.subscriptions.push(this.shared.languageChange.subscribe((path:any)=>{
      this.changeLanguage();
      this.getProducts();

    }))
    this.changeLanguage();
  }

  ngOnInit(): void {
    this.getProducts();
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

  changeLanguage(){
    if(localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
        this.LANG=environment.arabic_translations;
    }
    else {
        this.LANG=environment.english_translations;
    }
  }


}
