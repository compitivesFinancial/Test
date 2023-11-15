import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvestmentService } from '../investment.service';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-investmentdetails',
  templateUrl: './investmentdetails.component.html',
  styleUrls: ['./investmentdetails.component.css']
})
export class InvestmentdetailsComponent implements OnInit {
  public requestId: any
  public investmentDetailsList: any
  public investorDetails: any
  subscriptions: Subscription[] = [];
  LANG: any = {};

  constructor(private route: ActivatedRoute, public investmentservice: InvestmentService, public router: Router, private shared: SharedService) {
    this.subscriptions.push(this.shared.languageChange.subscribe((path: any) => {
      this.changeLanguage();
    }))
    this.changeLanguage();
  }

  ngOnInit(): void {
    this.requestId = atob(this.route.snapshot.params['id']);
    if (this.requestId != null) {
      this.investmentDetails()

    }
  }

  investmentDetails() {
    this.investmentservice.opertunityDetails(this.requestId).subscribe((res: any) => {
      this.investmentDetailsList = res.response.campaign
      this.investorDetails = res.response.received_investment
    })
  }

  percantageInvestment(a: number, b: number) {
    return (`${(a / b) * 100}`)
  }

  navTo() {
    if (this.requestId != null) {


      this.router.navigateByUrl(`/dashboard/${btoa(this.requestId)}`)
    }
  }

  changeLanguage() {
    if (localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
      this.LANG = environment.arabic_translations;
    }
    else {
      this.LANG = environment.english_translations;
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




