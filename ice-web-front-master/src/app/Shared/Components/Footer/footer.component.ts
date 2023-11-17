import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { CampaignService } from '../../Services/campaign.service';
import { SharedService } from '../../Services/shared.service';
import { StatementsService } from '../../Services/statements.service';
import { Footer } from '../../Models/footer';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  pages_list: any = [];
  LANG: any = {};
  logo: string = "assets/images/main-logo.png";
  logo_1: string = "assets/images/main-logo1.png";
  constructor(private footer: StatementsService, private router: Router, private shared: SharedService, public campaignService: CampaignService) {
    this.shared.languageChange.subscribe((path: any) => {
     
      this.getPageList();


    })
    this.changeLanguage();
  }

  ngOnInit(): void {
    this.getPageList();
    this.getFooter()
  }

  getPageList() {
    this.footer.getPagesList().subscribe((data: any) => {
      if (data.status) {
        this.pages_list = data.response;
      }
    })
  }

  changeLanguage() {
 
    this.shared.getLang().subscribe(lang => {
      if(lang=='ar'){
        this.LANG = environment.arabic_translations;
        this.logo = "assets/images/main-logo-ar.png";
        this.logo_1 = "assets/images/main-logo1-ar.png";
      }
      else {
        this.LANG = environment.english_translations;
        this.logo = "assets/images/main-logo.png";
        this.logo_1 = "assets/images/main-logo1.png";
        
      }
    });
  }


  goToDetails(data: any) {
    this.router.navigate(['/quick-link'], { queryParams: { id: btoa(btoa(data.id)) } })

  }
  investfooterDetails: any
  footerPages: Footer[] = []
  investDetails: Footer[] = []
  compDetails: Footer[] = []
  legalDetails: Footer[] = []
  raiseDetails: Footer[] = []

  getFooterOld() {
    this.campaignService.getHomeData().subscribe((res: any) => {
      this.investfooterDetails = res.response.footer.Invest


      this.compDetails = res.response.footer.Compp
      this.legalDetails = res.response.footer.Legal
      this.raiseDetails = res.response.footer.Raise
    })
  }
  getFooter(){
    this.campaignService.getFooter().subscribe((res:any)=>{
      this.investfooterDetails = res.response
    })
  }
  // getFooter() {
  //   this.campaignService.getFooter().subscribe(
  //     (data:any) => {
  //       this.footerPages = data;
  //     })
  //     this.calculateList();
  // }
  calculateList() {
    for (let item of this.footerPages) {
     // console.log(`the item data is ${item.title}`)
      switch (item.type) {
        case "1": this.investDetails.push(item); break;
        case "2": this.raiseDetails.push(item); break;
        case "3": this.legalDetails.push(item); break;
        case "4": this.compDetails.push(item); break;
      }
    }
  }
}
