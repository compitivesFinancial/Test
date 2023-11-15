import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CampaignService } from 'src/app/Shared/Services/campaign.service';
import { InvestmentService } from './investment.service';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { environment } from 'src/environments/environment';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';

@Component({
  selector: 'app-investment',
  templateUrl: './investment.component.html',
  styleUrls: ['./investment.component.css']
})
export class InvestmentComponent implements OnInit {

  public totalDetails:any
  user_data:any={};
  dashboard_data:any={};
  closedOPpertunity:boolean=false
  subscriptions:Subscription[]=[];
  LANG:any={};
  
  constructor(public investmentService:InvestmentService,private campaignService:CampaignService, public router:Router,private shared:SharedService,public decryptAES:decryptAesService) { 
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

    
    this.getDashboardDetails(1);
   
  
    if(this.user_data.role_type==3){
      this.closedOppertunityList()
      this.TotalDetails()
    }

    if(this.user_data.role_type==2){
      this.closedInvested()
      this.totalInvested()
    }
    // var countDownDate = new Date("Jan 5, 2024 15:37:25").getTime();

    // var countdownfunction = setInterval(function() {
    
    //   var now = new Date().getTime();
      
    //   var distance = countDownDate - now;
      
    //   var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    //   var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    //   var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    //   var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    //   // @ts-ignore
    //   document.getElementById("coming_soon").innerHTML = "<span>" + days + "d " + "</span>" + hours + "h "
    //   + minutes + "m " + seconds + "s ";
      
    //   if (distance < 0) {
    //     clearInterval(countdownfunction);
    //       // @ts-ignore
    //     document.getElementById("coming-soon").innerHTML = "EXPIRED";
    //   }
    // }, 1000);
      }
public details:any
public investedDetails:any=[]
public investedPercentage:any
public closedDetails:any
closedOPpertunityInvester:boolean= false
        TotalDetails(){
          // const data={user_id:this.user_data.id}
          this.investmentService.totalOppertunities(this.user_data.id).subscribe((res:any)=>{
            this.totalDetails= res.response
            
            
          })
        }

        percantageInvestment(a:number,b:number){
          return(`${(a/b)*100}`)
        }
        
        getDashboardDetails(type?:number){
          const data={user_id:this.user_data.id}
          this.campaignService.investorDashboard(data,type).subscribe((res:any)=>{
            this.dashboard_data=res.response.data.investor_id
            
          })
          
        }
        closedOpertunity(){
          this.closedOPpertunity= true
          this.closedOPpertunityInvester= true
          this.openOPpertunityInvester= false
        }
        public openOPpertunityInvester:boolean= true
        openOppertunity(){

          this.closedOPpertunity= false
          this.closedOPpertunityInvester= false
          this.openOPpertunityInvester= true
        }

        totalInvested(){

          this.investmentService.totalInvested(this.user_data.id).subscribe((res:any)=>{
            this.investedDetails = res.response
            // console.log(this.investedDetails);

          })

        }
public closedInvestedDetails:any
        closedInvested(){

          this.investmentService.closedInvested(this.user_data.id).subscribe((res:any)=>{
            this.closedInvestedDetails = res.response
          })

        }


        navToDetails(opertunityDetailList:any){
          if(opertunityDetailList.id>0){
          this.router.navigateByUrl(`/investment/${btoa(opertunityDetailList.id)}`)
          }
        }

        navTo(opertunityDetailList:any){
          if(opertunityDetailList.id>0 ){
            this.router.navigateByUrl(`/investment/${btoa(opertunityDetailList.id)}`)
            }
        }

        navToDetailsInvest(opertunityDetailList:any){
          if(opertunityDetailList.id>0){
          this.router.navigateByUrl(`/operationdetails/${btoa(opertunityDetailList.id)}`)
          }
        }

        navToDetailsInvestNull(opertunityDetailList:any){
          if(opertunityDetailList.id>0){
          this.router.navigateByUrl(`/dashboard/${btoa(opertunityDetailList.id)}`)
          }
        }

        closedOppertunityList(){
          this.investmentService.closeOppertunities(this.user_data.id).subscribe((res:any)=>{
            this.closedDetails= res.response
          })
        }

        navToLoan(){
          this.router.navigateByUrl(`/wallet`)
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
  }


