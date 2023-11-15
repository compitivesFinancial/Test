import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { StatementsService } from 'src/app/Shared/Services/statements.service';
import { environment } from 'src/environments/environment';
declare const $: any;

@Component({
  selector: 'app-profits',
  templateUrl: './profits.component.html',
  styleUrls: ['./profits.component.css']
})
export class ProfitsComponent implements OnInit {
  profit_list: any = [];
  subscriptions: Subscription[] = [];
  campaign_id: string = ""
  LANG: any = {};

  constructor(private statmentsService: StatementsService, private route: ActivatedRoute, private shared: SharedService) {

    this.subscriptions.push(this.route.queryParams
      .subscribe((params: Params) => {
        if (params['id']) {
          this.campaign_id = atob(atob(params['id']));
          this.getProfits()

        }
      }))
    this.subscriptions.push(this.shared.languageChange.subscribe((path: any) => {
      this.changeLanguage();
    }))
    this.changeLanguage();
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

  ngOnInit(): void {
  }

  getProfits() {
    const data = { campaign_id: this.campaign_id }
    this.subscriptions.push(this.statmentsService.getProfits(data).subscribe((res: any) => {
      this.profit_list = res.response;
      setTimeout(() => {
        $('#borrowers').DataTable({
          ordering: false,
          responsive: true,

        });
      }, 100);
    }))
  }

}
